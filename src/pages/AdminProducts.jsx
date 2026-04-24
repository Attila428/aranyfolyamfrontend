import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import {
    getAllProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "../api/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://nodejs213.dszcbaross.edu.hu";

function getImageSrc(imagePath) {
    if (!imagePath) return "";
    if (imagePath instanceof File) {
        return URL.createObjectURL(imagePath);
    }
    if (
        typeof imagePath === "string" &&
        (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
        return imagePath;
    }
    if (typeof imagePath === "string") {
        return `${BACKEND_URL}${imagePath}`;
    }
    return "";
}

export default function AdminProducts() {
    const { user, loading, errorUser, onLogout } = useAuth();

    const [products, setProducts] = useState([]);
    const [productsError, setProductsError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [savingId, setSavingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalError, setModalError] = useState("");

    const [newProduct, setNewProduct] = useState({
        category_id: "",
        product_name: "",
        product_price: "",
        product_image: null,
        product_stock: ""
    });

    useEffect(() => {
        async function fetchProducts() {
            const data = await getAllProduct();

            if (data?.error) {
                setProductsError(data.error);
                setProducts([]);
                return;
            }

            const normalized = (Array.isArray(data) ? data : []).map((product) => ({
                ...product,
                product_image_file: null,
                original_category_id: product.category_id ?? "",
                original_product_name: product.product_name ?? "",
                original_product_price: product.product_price ?? "",
                original_product_stock: product.product_stock ?? ""
            }));

            setProducts(normalized);
            setProductsError("");
        }

        if (!loading && user?.user_role === "admin") {
            fetchProducts();
        }
    }, [user, loading]);

    function handleFieldChange(productId, field, value) {
        setProducts((prev) =>
            prev.map((product) =>
                product.product_id === productId
                    ? { ...product, [field]: value }
                    : product
            )
        );
    }

    function handleImageFileChange(productId, file) {
        setProducts((prev) =>
            prev.map((product) =>
                product.product_id === productId
                    ? { ...product, product_image_file: file || null }
                    : product
            )
        );
    }

    async function handleSaveProduct(product) {
        setProductsError("");
        setSuccessMessage("");
        setSavingId(product.product_id);

        const updatedFields = {
            product_id: product.product_id
        };

        const currentCategoryId = String(product.category_id ?? "").trim();
        const originalCategoryId = String(product.original_category_id ?? "").trim();

        const currentProductName = String(product.product_name ?? "").trim();
        const originalProductName = String(product.original_product_name ?? "").trim();

        const currentProductPrice = String(product.product_price ?? "").trim();
        const originalProductPrice = String(product.original_product_price ?? "").trim();

        const currentProductStock = String(product.product_stock ?? "").trim();
        const originalProductStock = String(product.original_product_stock ?? "").trim();

        if (currentCategoryId !== originalCategoryId) {
            if (!currentCategoryId) {
                setProductsError("A kategória azonosító nem lehet üres.");
                setSavingId(null);
                return;
            }
            updatedFields.category_id = Number(currentCategoryId);
        }

        if (currentProductName !== originalProductName) {
            if (!currentProductName) {
                setProductsError("A termék neve nem lehet üres.");
                setSavingId(null);
                return;
            }
            updatedFields.product_name = currentProductName;
        }

        if (currentProductPrice !== originalProductPrice) {
            if (!currentProductPrice) {
                setProductsError("Az ár nem lehet üres.");
                setSavingId(null);
                return;
            }
            updatedFields.product_price = Number(currentProductPrice);
        }

        if (currentProductStock !== originalProductStock) {
            if (!currentProductStock) {
                setProductsError("A készlet nem lehet üres.");
                setSavingId(null);
                return;
            }
            updatedFields.product_stock = Number(currentProductStock);
        }

        if (product.product_image_file) {
            updatedFields.product_image = product.product_image_file;
        }

        if (Object.keys(updatedFields).length === 1) {
            setProductsError("Nincs menthető módosítás.");
            setSavingId(null);
            return;
        }

        const res = await updateProduct(updatedFields);

        if (res?.error) {
            setProductsError(res.error);
            setSavingId(null);
            return;
        }

        const refreshed = await getAllProduct();
        if (!refreshed?.error) {
            setProducts(
                (Array.isArray(refreshed) ? refreshed : []).map((item) => ({
                    ...item,
                    product_image_file: null,
                    original_category_id: item.category_id ?? "",
                    original_product_name: item.product_name ?? "",
                    original_product_price: item.product_price ?? "",
                    original_product_stock: item.product_stock ?? ""
                }))
            );
        }

        setSuccessMessage(`A(z) #${product.product_id} termék sikeresen módosítva.`);
        setSavingId(null);
    }

    async function handleDeleteProduct(product_id) {
        setProductsError("");
        setSuccessMessage("");
        setDeletingId(product_id);

        const res = await deleteProduct(product_id);

        if (res?.error) {
            setProductsError(res.error);
            setDeletingId(null);
            return;
        }

        setProducts((prev) => prev.filter((p) => p.product_id !== product_id));
        setSuccessMessage(`A(z) #${product_id} termék sikeresen törölve.`);
        setDeletingId(null);
    }

    async function handleCreateProduct() {
        setModalError("");
        setProductsError("");
        setSuccessMessage("");

        if (
            newProduct.category_id === "" ||
            !newProduct.product_name.trim() ||
            newProduct.product_price === "" ||
            !newProduct.product_image ||
            newProduct.product_stock === ""
        ) {
            setModalError("Minden mező kitöltése kötelező.");
            return;
        }

        const res = await createProduct({
            category_id: Number(newProduct.category_id),
            product_name: newProduct.product_name.trim(),
            product_price: Number(newProduct.product_price),
            product_image: newProduct.product_image,
            product_stock: Number(newProduct.product_stock)
        });

        if (res?.error) {
            setModalError(res.error);
            return;
        }

        const refreshed = await getAllProduct();

        if (!refreshed?.error) {
            setProducts(
                (Array.isArray(refreshed) ? refreshed : []).map((item) => ({
                    ...item,
                    product_image_file: null,
                    original_category_id: item.category_id ?? "",
                    original_product_name: item.product_name ?? "",
                    original_product_price: item.product_price ?? "",
                    original_product_stock: item.product_stock ?? ""
                }))
            );
        }

        setNewProduct({
            category_id: "",
            product_name: "",
            product_price: "",
            product_image: null,
            product_stock: ""
        });
        setShowModal(false);
        setSuccessMessage("Új termék sikeresen létrehozva.");
    }

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    if (!loading && (!user || user.user_role !== "admin")) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <NavBar user={user} onLogout={onLogout} />

            <div
                className="container-fluid min-vh-100 py-3 py-md-4 px-2 px-md-3"
                style={{ background: "linear-gradient(90deg, #000000, #1a0000)" }}
            >
                <div className="container">
                    <div className="mx-auto" style={{ maxWidth: "1200px" }}>
                        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-4">
                            <h1 className="text-white text-center text-md-start mb-0">
                                Termékek kezelése
                            </h1>

                            <button
                                className="btn btn-success fw-bold px-4 py-2"
                                onClick={() => {
                                    setModalError("");
                                    setShowModal(true);
                                }}
                            >
                                Új termék feltöltése
                            </button>
                        </div>

                        {errorUser && (
                            <div className="alert alert-danger text-center rounded-4">
                                {errorUser}
                            </div>
                        )}

                        {productsError && (
                            <div className="alert alert-danger text-center rounded-4">
                                {productsError}
                            </div>
                        )}

                        {successMessage && (
                            <div className="alert alert-success text-center rounded-4">
                                {successMessage}
                            </div>
                        )}

                        {products.length === 0 && !productsError ? (
                            <div className="border border-2 rounded-4 py-3 px-3 bg-danger border-danger text-center">
                                <span className="text-white fw-bold fs-6">
                                    Nem található termék!
                                </span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-4">
                                {products.map((product) => (
                                    <div
                                        key={product.product_id}
                                        className="bg-danger border border-light rounded-4 p-3 p-md-4 shadow-sm"
                                    >
                                        <div className="row g-3">
                                            <div className="col-12 col-xl-2">
                                                <div className="fw-semibold text-light mb-2">Kép</div>
                                                <img
                                                    src={getImageSrc(product.product_image_file || product.product_image)}
                                                    alt={product.product_name}
                                                    className="img-fluid rounded-3 border bg-light"
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "180px",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            </div>

                                            <div className="col-12 col-xl-10">
                                                <div className="row g-3">
                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label text-light fw-semibold">
                                                            Termék azonosító
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={product.product_id}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label text-light fw-semibold">
                                                            Kategória azonosító
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={product.category_id ?? ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    product.product_id,
                                                                    "category_id",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-4">
                                                        <label className="form-label text-light fw-semibold">
                                                            Kategória neve
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={product.category_name || ""}
                                                            disabled
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label text-light fw-semibold">
                                                            Termék neve
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={product.product_name || ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    product.product_id,
                                                                    "product_name",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label text-light fw-semibold">
                                                            Új termékkép
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                                            onChange={(e) =>
                                                                handleImageFileChange(
                                                                    product.product_id,
                                                                    e.target.files?.[0] || null
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label text-light fw-semibold">
                                                            Ár
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={product.product_price ?? ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    product.product_id,
                                                                    "product_price",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label className="form-label text-light fw-semibold">
                                                            Készlet
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={product.product_stock ?? ""}
                                                            onChange={(e) =>
                                                                handleFieldChange(
                                                                    product.product_id,
                                                                    "product_stock",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-column flex-md-row gap-2 mt-4">
                                                    <button
                                                        className="btn btn-warning fw-bold w-100"
                                                        onClick={() => handleSaveProduct(product)}
                                                        disabled={savingId === product.product_id}
                                                    >
                                                        {savingId === product.product_id ? "Mentés..." : "Módosítások mentése"}
                                                    </button>

                                                    <button
                                                        className="btn btn-danger fw-bold w-100"
                                                        onClick={() => handleDeleteProduct(product.product_id)}
                                                        disabled={deletingId === product.product_id}
                                                    >
                                                        {deletingId === product.product_id ? "Törlés..." : "Termék törlése"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg px-2">
                        <div className="modal-content rounded-4 border-0">
                            <div className="modal-header">
                                <h5 className="modal-title">Új termék feltöltése</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-semibold">Kategória azonosító</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newProduct.category_id}
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    category_id: e.target.value
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-semibold">Termék neve</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newProduct.product_name}
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    product_name: e.target.value
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-semibold">Ár</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newProduct.product_price}
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    product_price: e.target.value
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-semibold">Készlet</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newProduct.product_stock}
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    product_stock: e.target.value
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold">Kép feltöltése</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={(e) =>
                                                setNewProduct((prev) => ({
                                                    ...prev,
                                                    product_image: e.target.files?.[0] || null
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                {modalError && (
                                    <div className="alert alert-danger mt-3 mb-0">
                                        {modalError}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Mégse
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success fw-bold"
                                    onClick={handleCreateProduct}
                                >
                                    Termék mentése
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