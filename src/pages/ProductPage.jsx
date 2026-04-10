import { useState, useEffect } from "react";
import Product from "../components/Product";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getAllProduct, createOrder } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Products() {
    const { user, onLogout, loading } = useAuth();

    const [allProduct, setAllProduct] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [searchProduct, setSearchProduct] = useState("");

    const navigate = useNavigate();
    const isLoggedIn = !!user;

    useEffect(() => {
        async function loadProduct() {
            const data = await getAllProduct();

            if (!data?.error) {
                setAllProduct(data || []);
            } else {
                console.error(data?.error);
            }
        }

        loadProduct();
    }, []);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch {
                setCart([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    async function handleLogout() {
        await onLogout();
        navigate("/");
    }

    function onAddToCart(product) {
        if (!isLoggedIn) return;

        setCart((prevCart) => {
            const existingProduct = prevCart.find(
                (item) => item.product_id === product.product_id
            );

            if (existingProduct) {
                if (existingProduct.quantity >= product.product_stock) {
                    return prevCart;
                }

                return prevCart.map((item) =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            if (product.product_stock <= 0) {
                return prevCart;
            }

            return [...prevCart, { ...product, quantity: 1 }];
        });

        setShowCart(true);
        setCheckoutStep(false);
        setOrderError(null);
        setOrderSuccess(null);
    }

    function increaseQuantity(productId) {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.product_id === productId
                    ? item.quantity < item.product_stock
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    : item
            )
        );
    }

    function decreaseQuantity(productId) {
    setCart((prevCart) =>
        prevCart
            .map((item) => {
                if (item.product_id !== productId) return item;

                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            })
            .filter((item) => item.quantity > 0)
    );
}

    function removeFromCart(productId) {
        setCart((prevCart) =>
            prevCart.filter((item) => item.product_id !== productId)
        );
    }

    function clearCart() {
        setCart([]);
        localStorage.removeItem("cart");
        setShowCart(false);
        setCheckoutStep(false);
        setOrderError(null);
        setOrderSuccess(null);
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cart.reduce((sum, item) => {
        const price = Number(item.product_price) || 0;
        return sum + price * item.quantity;
    }, 0);

    const filteredProducts = allProduct.filter((product) =>
        product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
    );

    async function finalizeOrder() {
        if (!user || !user.user_id) {
            setOrderError("Be kell jelentkezned a rendeléshez!");
            return;
        }

        if (cart.length === 0) {
            setOrderError("A kosár üres.");
            return;
        }

        setOrderLoading(true);
        setOrderError(null);
        setOrderSuccess(null);

        const orderData = {
            user_id: user.user_id,
            items: cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
            })),
        };

        const result = await createOrder(orderData.user_id, orderData.items);

        if (result?.error) {
            setOrderError(result.error);
            setOrderLoading(false);
            return;
        }

        setOrderSuccess("Rendelés sikeresen mentve.");
        setCart([]);
        localStorage.removeItem("cart");
        setOrderLoading(false);
        setCheckoutStep(false);
    }

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    return (
        <>
            <NavBar user={user} onLogout={handleLogout} />

            <div
                className="container-fluid min-vh-100 d-flex py-4"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-white m-0">Termékek</h2>
                        {isLoggedIn && (
                            <button
                                className="btn btn-danger"
                                onClick={() => setShowCart(true)}
                            >
                                Kosár ({totalItems})
                            </button>
                        )}
                    </div>
                    <div className="my-4">
                        <input
                            type="text"
                            className="form-control mb-3 meno fw-bold border-danger"
                            placeholder="Mit keresel?"
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                        />
                    </div>
                    <div className="row row-gap-4">
                        <Product
                            allProduct={filteredProducts}
                            onAddToCart={onAddToCart}
                            isLoggedIn={isLoggedIn}
                        />
                    </div>
                </div>
            </div>

            {showCart && isLoggedIn && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
                >
                    <div className="container h-100 d-flex justify-content-center align-items-center">
                        <div
                            className="bg-white p-4 rounded shadow"
                            style={{
                                width: "100%",
                                maxWidth: "700px",
                                maxHeight: "85vh",
                                overflowY: "auto",
                            }}
                        >
                            {!checkoutStep ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3 className="m-0">Kosár</h3>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowCart(false)}
                                        >
                                            Bezárás
                                        </button>
                                    </div>

                                    {cart.length === 0 ? (
                                        <p>A kosár üres.</p>
                                    ) : (
                                        <>
                                            {cart.map((item) => (
                                                <div
                                                    key={item.product_id}
                                                    className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                                                >
                                                    <div>
                                                        <h5 className="mb-1">{item.product_name}</h5>
                                                        <p className="mb-1">
                                                            Egységár: {item.product_price} Ft
                                                        </p>
                                                        <p className="mb-1">
                                                            Mennyiség: {item.quantity} db
                                                        </p>
                                                        <p className="mb-0 fw-bold">
                                                            Részösszeg:{" "}
                                                            {(Number(item.product_price) || 0) *
                                                                item.quantity}{" "}
                                                            Ft
                                                        </p>
                                                    </div>

                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-outline-dark"
                                                            onClick={() =>
                                                                decreaseQuantity(item.product_id)
                                                            }
                                                        >
                                                            -
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-dark"
                                                            onClick={() =>
                                                                increaseQuantity(item.product_id)
                                                            }
                                                            disabled={item.quantity >= item.product_stock}
                                                        >
                                                            +
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() =>
                                                                removeFromCart(item.product_id)
                                                            }
                                                        >
                                                            Törlés
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <h4>Összesen: {totalPrice} Ft</h4>

                                            <div className="d-flex gap-2 mt-3">
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => setCheckoutStep(true)}
                                                >
                                                    Tovább
                                                </button>

                                                <button
                                                    className="btn btn-danger"
                                                    onClick={clearCart}
                                                >
                                                    Kosár ürítése
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h3 className="m-0">Rendelés véglegesítése</h3>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setCheckoutStep(false)}
                                        >
                                            Vissza
                                        </button>
                                    </div>

                                    <p>Kérlek ellenőrizd a rendelésed:</p>

                                    {cart.map((item) => (
                                        <div
                                            key={item.product_id}
                                            className="border-bottom py-2"
                                        >
                                            {item.product_name} - {item.quantity} db -{" "}
                                            {(Number(item.product_price) || 0) *
                                                item.quantity}{" "}
                                            Ft
                                        </div>
                                    ))}

                                    <h4 className="mt-3">Végösszeg: {totalPrice} Ft</h4>

                                    {orderError && (
                                        <div className="alert alert-danger mt-3">
                                            {orderError}
                                        </div>
                                    )}

                                    {orderSuccess && (
                                        <div className="alert alert-success mt-3">
                                            {orderSuccess}
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-success mt-3"
                                        onClick={finalizeOrder}
                                        disabled={orderLoading}
                                    >
                                        {orderLoading
                                            ? "Küldés..."
                                            : "Rendelés véglegesítése"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}