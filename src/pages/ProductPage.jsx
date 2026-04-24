import { useState, useEffect } from "react";
import Product from "../components/Product";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getAllProduct, createOrder } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://nodejs213.dszcbaross.edu.hu";

function getImageSrc(imagePath) {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${imagePath}`;
}

export default function Products() {
    const { user, onLogout, loading } = useAuth();

    const [allProduct, setAllProduct] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const [searchProduct, setSearchProduct] = useState("");
    const [minAvailablePrice, setMinAvailablePrice] = useState(0);
    const [maxAvailablePrice, setMaxAvailablePrice] = useState(100000);
    const [priceRange, setPriceRange] = useState([0, 100000]);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [showCardModal, setShowCardModal] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);

    const [cardData, setCardData] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
    });

    const [billingData, setBillingData] = useState({
        billingName: "",
        billingEmail: "",
        billingPhone: "",
        billingZip: "",
        billingCity: "",
        billingAddress: "",
        billingNote: ""
    });

    const navigate = useNavigate();
    const isLoggedIn = !!user;

    useEffect(() => {
        async function loadProduct() {
            const data = await getAllProduct();

            if (!data?.error) {
                const products = (data || []).map((product) => ({
                    ...product,
                    product_image: getImageSrc(product.product_image)
                }));

                setAllProduct(products);

                if (products.length > 0) {
                    const prices = products.map((p) => Number(p.product_price) || 0);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);

                    setMinAvailablePrice(min);
                    setMaxAvailablePrice(max);
                    setPriceRange([min, max]);
                }
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

    function handleMinChange(value) {
        const safeValue = Number.isNaN(value) ? minAvailablePrice : value;
        const clampedValue = Math.max(
            minAvailablePrice,
            Math.min(safeValue, priceRange[1])
        );
        setPriceRange([clampedValue, priceRange[1]]);
    }

    function handleMaxChange(value) {
        const safeValue = Number.isNaN(value) ? maxAvailablePrice : value;
        const clampedValue = Math.min(
            maxAvailablePrice,
            Math.max(safeValue, priceRange[0])
        );
        setPriceRange([priceRange[0], clampedValue]);
    }

    function resetPriceFilter() {
        setPriceRange([minAvailablePrice, maxAvailablePrice]);
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
        setPaymentMethod("cash");
        setShowCardModal(false);
        setShowBillingModal(false);
        setCardData({
            cardName: "",
            cardNumber: "",
            expiry: "",
            cvc: ""
        });
        setBillingData({
            billingName: "",
            billingEmail: "",
            billingPhone: "",
            billingZip: "",
            billingCity: "",
            billingAddress: "",
            billingNote: ""
        });
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = cart.reduce((sum, item) => {
        const price = Number(item.product_price) || 0;
        return sum + price * item.quantity;
    }, 0);

    const filteredProducts = allProduct.filter((product) => {
        const price = Number(product.product_price) || 0;

        return (
            product.product_name.toLowerCase().includes(searchProduct.toLowerCase()) &&
            price >= priceRange[0] &&
            price <= priceRange[1]
        );
    });

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
        setShowCardModal(false);
        setShowBillingModal(false);
        setPaymentMethod("cash");
        setCardData({
            cardName: "",
            cardNumber: "",
            expiry: "",
            cvc: ""
        });
        setBillingData({
            billingName: "",
            billingEmail: "",
            billingPhone: "",
            billingZip: "",
            billingCity: "",
            billingAddress: "",
            billingNote: ""
        });
    }

    function handleCheckoutSubmit() {
        setOrderError(null);

        if (paymentMethod === "card") {
            setShowCardModal(true);
            return;
        }

        setShowBillingModal(true);
    }

    function handleCardContinue() {
        setShowCardModal(false);
        setShowBillingModal(true);
    }

    const rangePercentLeft =
        maxAvailablePrice === minAvailablePrice
            ? 0
            : ((priceRange[0] - minAvailablePrice) /
                  (maxAvailablePrice - minAvailablePrice)) *
              100;

    const rangePercentRight =
        maxAvailablePrice === minAvailablePrice
            ? 0
            : 100 -
              ((priceRange[1] - minAvailablePrice) /
                  (maxAvailablePrice - minAvailablePrice)) *
                  100;

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    return (
        <>
            <NavBar user={user} onLogout={handleLogout} />

            <div
                className="container-fluid min-vh-100 py-4"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h2 className="text-white m-0">Termékek</h2>

                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                className="btn btn-outline-light d-lg-none"
                                onClick={() => setShowFilter((prev) => !prev)}
                            >
                                {showFilter ? "Szűrő bezárása" : "Szűrő megnyitása"}
                            </button>

                            {isLoggedIn && (
                                <button className="btn btn-danger" onClick={() => setShowCart(true)}>
                                    Kosár ({totalItems})
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="row g-4 align-items-start">
                        <div
                            className={`col-12 col-lg-3 ${
                                showFilter ? "d-block" : "d-none d-lg-block"
                            }`}
                        >
                            <div className="bg-dark text-white p-3 rounded-4 border border-danger product-filter-box">
                                <h4 className="mb-3">Szűrők</h4>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Keresés</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold border-danger"
                                        placeholder="Mit keresel?"
                                        value={searchProduct}
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Minimum ár</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={minAvailablePrice}
                                        max={priceRange[1]}
                                        value={priceRange[0]}
                                        onChange={(e) => handleMinChange(Number(e.target.value))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Maximum ár</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={priceRange[0]}
                                        max={maxAvailablePrice}
                                        value={priceRange[1]}
                                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold d-block">Ár tartomány</label>

                                    <div className="price-range-wrapper">
                                        <div className="price-range-base"></div>

                                        <div
                                            className="price-range-active"
                                            style={{
                                                left: `${rangePercentLeft}%`,
                                                right: `${rangePercentRight}%`
                                            }}
                                        ></div>

                                        <input
                                            type="range"
                                            className="price-range-input"
                                            min={minAvailablePrice}
                                            max={maxAvailablePrice}
                                            value={priceRange[0]}
                                            onChange={(e) => handleMinChange(Number(e.target.value))}
                                        />

                                        <input
                                            type="range"
                                            className="price-range-input"
                                            min={minAvailablePrice}
                                            max={maxAvailablePrice}
                                            value={priceRange[1]}
                                            onChange={(e) => handleMaxChange(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3 text-center fw-bold">
                                    {priceRange[0].toLocaleString("hu-HU")} Ft -{" "}
                                    {priceRange[1].toLocaleString("hu-HU")} Ft
                                </div>

                                <button
                                    className="btn btn-outline-light w-100"
                                    onClick={resetPriceFilter}
                                >
                                    Szűrő visszaállítása
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-lg-9">
                            {filteredProducts.length === 0 ? (
                                <div className="bg-dark text-white border border-danger rounded-4 p-4 text-center">
                                    Nincs a szűrésnek megfelelő termék.
                                </div>
                            ) : (
                                <div className="row row-gap-4">
                                    <Product
                                        allProduct={filteredProducts}
                                        onAddToCart={onAddToCart}
                                        isLoggedIn={isLoggedIn}
                                    />
                                </div>
                            )}
                        </div>
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
                                        <button className="btn btn-secondary" onClick={() => setShowCart(false)}>
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
                                                    className="border rounded p-3 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                                                >
                                                    <div className="d-flex gap-3 align-items-start flex-column flex-sm-row">
                                                        {item.product_image && (
                                                            <img
                                                                src={item.product_image}
                                                                alt={item.product_name}
                                                                className="rounded border"
                                                                style={{
                                                                    width: "90px",
                                                                    height: "90px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                        )}

                                                        <div>
                                                            <h5 className="mb-1">{item.product_name}</h5>
                                                            <p className="mb-1">Egységár: {item.product_price} Ft</p>
                                                            <p className="mb-1">Mennyiség: {item.quantity} db</p>
                                                            <p className="mb-0 fw-bold">
                                                                Részösszeg: {(Number(item.product_price) || 0) * item.quantity} Ft
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <button
                                                            className="btn btn-outline-dark"
                                                            onClick={() => decreaseQuantity(item.product_id)}
                                                        >
                                                            -
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-dark"
                                                            onClick={() => increaseQuantity(item.product_id)}
                                                            disabled={item.quantity >= item.product_stock}
                                                        >
                                                            +
                                                        </button>

                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => removeFromCart(item.product_id)}
                                                        >
                                                            Törlés
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <h4>Összesen: {totalPrice} Ft</h4>

                                            <div className="d-flex gap-2 mt-3 flex-wrap">
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => {
                                                        setCheckoutStep(true);
                                                        setOrderError(null);
                                                        setOrderSuccess(null);
                                                    }}
                                                >
                                                    Tovább
                                                </button>

                                                <button className="btn btn-danger" onClick={clearCart}>
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
                                        <button className="btn btn-secondary" onClick={() => setCheckoutStep(false)}>
                                            Vissza
                                        </button>
                                    </div>

                                    <p>Kérlek ellenőrizd a rendelésed:</p>

                                    {cart.map((item) => (
                                        <div key={item.product_id} className="border-bottom py-2 d-flex gap-3 align-items-center">
                                            {item.product_image && (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="rounded border"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            )}

                                            <div>
                                                {item.product_name} - {item.quantity} db -{" "}
                                                {(Number(item.product_price) || 0) * item.quantity} Ft
                                            </div>
                                        </div>
                                    ))}

                                    <h4 className="mt-3">Végösszeg: {totalPrice} Ft</h4>

                                    <div className="mt-4">
                                        <label className="form-label fw-bold">Fizetési mód</label>

                                        <div className="d-flex flex-column gap-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cashPayment"
                                                    value="cash"
                                                    checked={paymentMethod === "cash"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="cashPayment">
                                                    Készpénz
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="paymentMethod"
                                                    id="cardPayment"
                                                    value="card"
                                                    checked={paymentMethod === "card"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor="cardPayment">
                                                    Bankkártya
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {orderError && <div className="alert alert-danger mt-3">{orderError}</div>}
                                    {orderSuccess && <div className="alert alert-success mt-3">{orderSuccess}</div>}

                                    <button
                                        className="btn btn-success mt-3"
                                        onClick={handleCheckoutSubmit}
                                        disabled={orderLoading}
                                    >
                                        {paymentMethod === "card"
                                            ? "Tovább a kártyaadatokhoz"
                                            : "Tovább a számlázási adatokhoz"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showCardModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1060 }}
                >
                    <div className="container h-100 d-flex justify-content-center align-items-center">
                        <div
                            className="bg-white p-4 rounded shadow"
                            style={{
                                width: "100%",
                                maxWidth: "520px",
                                maxHeight: "85vh",
                                overflowY: "auto",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Kártyás fizetés</h3>
                                <button className="btn btn-secondary" onClick={() => setShowCardModal(false)}>
                                    Vissza
                                </button>
                            </div>

                            <p className="text-muted">
                                Add meg a kártyaadatokat. Ezeket a felület csak megjeleníti,
                                külön nem dolgozza fel.
                            </p>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Kártyatulajdonos neve</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cardData.cardName}
                                    onChange={(e) =>
                                        setCardData((prev) => ({
                                            ...prev,
                                            cardName: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Kártyaszám</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardData.cardNumber}
                                    onChange={(e) =>
                                        setCardData((prev) => ({
                                            ...prev,
                                            cardNumber: e.target.value
                                        }))
                                    }
                                />
                            </div>

                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Lejárat</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="MM/ÉÉ"
                                        value={cardData.expiry}
                                        onChange={(e) =>
                                            setCardData((prev) => ({
                                                ...prev,
                                                expiry: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">CVC</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="123"
                                        value={cardData.cvc}
                                        onChange={(e) =>
                                            setCardData((prev) => ({
                                                ...prev,
                                                cvc: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {orderError && <div className="alert alert-danger mt-3">{orderError}</div>}

                            <div className="mt-4 d-flex gap-2 flex-column flex-sm-row">
                                <button className="btn btn-secondary w-100" onClick={() => setShowCardModal(false)}>
                                    Mégse
                                </button>

                                <button className="btn btn-success w-100" onClick={handleCardContinue}>
                                    Tovább a számlázási adatokhoz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showBillingModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1070 }}
                >
                    <div className="container h-100 d-flex justify-content-center align-items-center">
                        <div
                            className="bg-white p-4 rounded shadow"
                            style={{
                                width: "100%",
                                maxWidth: "650px",
                                maxHeight: "85vh",
                                overflowY: "auto",
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Számlázási adatok</h3>
                                <button className="btn btn-secondary" onClick={() => setShowBillingModal(false)}>
                                    Vissza
                                </button>
                            </div>

                            <p className="text-muted">
                                Add meg a számlázási adatokat. Ezeket a felület csak megjeleníti,
                                külön nem kerülnek feldolgozásra.
                            </p>

                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Név / Cégnév</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={billingData.billingName}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingName: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Email cím</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={billingData.billingEmail}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingEmail: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Telefonszám</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={billingData.billingPhone}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingPhone: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Irányítószám</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={billingData.billingZip}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingZip: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Város</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={billingData.billingCity}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingCity: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-bold">Cím</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={billingData.billingAddress}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingAddress: e.target.value
                                            }))
                                        }
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Megjegyzés</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={billingData.billingNote}
                                        onChange={(e) =>
                                            setBillingData((prev) => ({
                                                ...prev,
                                                billingNote: e.target.value
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {orderError && <div className="alert alert-danger mt-3">{orderError}</div>}
                            {orderSuccess && <div className="alert alert-success mt-3">{orderSuccess}</div>}

                            <div className="mt-4 d-flex gap-2 flex-column flex-sm-row">
                                <button className="btn btn-secondary w-100" onClick={() => setShowBillingModal(false)}>
                                    Mégse
                                </button>

                                <button
                                    className="btn btn-success w-100"
                                    onClick={finalizeOrder}
                                    disabled={orderLoading}
                                >
                                    {orderLoading ? "Küldés..." : "Rendelés leadása"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}