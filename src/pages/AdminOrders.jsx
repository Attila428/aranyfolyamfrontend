import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../api/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://nodejs213.dszcbaross.edu.hu";

function getImageSrc(imagePath) {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
}

export default function AdminOrders() {
    const { user, loading, errorUser, onLogout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [editedStatuses, setEditedStatuses] = useState({});
    const [savingOrderId, setSavingOrderId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            const data = await getAllOrders();

            if (data?.error) {
                setError(data.error);
                setOrders([]);
                return;
            }

            setError("");
            setOrders(Array.isArray(data) ? data : []);
        }

        if (!loading && user?.user_role === "admin") {
            fetchOrders();
        }
    }, [user, loading]);

    const groupedOrders = useMemo(() => {
        const grouped = {};

        for (const row of orders) {
            if (!grouped[row.order_id]) {
                grouped[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    user_username: row.user_username,
                    order_date: row.order_date,
                    order_status: row.order_status,
                    items: [],
                    total: 0
                };
            }

            const itemTotal =
                Number(row.product_price || 0) * Number(row.order_count || 0);

            grouped[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                product_image: row.product_image || "",
                product_price: Number(row.product_price || 0),
                order_count: Number(row.order_count || 0),
                item_total: itemTotal
            });

            grouped[row.order_id].total += itemTotal;
        }

        return Object.values(grouped);
    }, [orders]);

    function handleStatusSelect(order_id, newStatus) {
        setEditedStatuses((prev) => ({
            ...prev,
            [order_id]: newStatus
        }));
    }

    async function handleSaveStatus(order_id) {
        const selectedStatus = editedStatuses[order_id];
        if (!selectedStatus) return;

        setSavingOrderId(order_id);
        setSuccessMessage("");

        const res = await updateOrderStatus(order_id, selectedStatus);

        if (res?.error) {
            setError(res.error);
            setSavingOrderId(null);
            return;
        }

        setOrders((prev) =>
            prev.map((orderRow) =>
                orderRow.order_id === order_id
                    ? { ...orderRow, order_status: selectedStatus }
                    : orderRow
            )
        );

        setEditedStatuses((prev) => {
            const copy = { ...prev };
            delete copy[order_id];
            return copy;
        });

        setError("");
        setSuccessMessage(`A(z) #${order_id} rendelés státusza elmentve.`);
        setSavingOrderId(null);
    }

    function translateStatus(status) {
        switch (status) {
            case "delivered":
                return "Kiszállítva";
            case "shipping":
                return "Szállítás alatt";
            case "cancelled":
                return "Törölve";
            default:
                return status;
        }
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case "delivered":
                return "bg-success";
            case "shipping":
                return "bg-warning text-dark";
            case "cancelled":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
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
                        <h1 className="text-white text-center text-md-start mb-4">
                            Összes rendelés kezelése
                        </h1>

                        {errorUser && (
                            <div className="alert alert-danger text-center rounded-4">
                                {errorUser}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger text-center rounded-4">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="alert alert-success text-center rounded-4">
                                {successMessage}
                            </div>
                        )}

                        {groupedOrders.length === 0 && !error ? (
                            <div className="border border-2 rounded-4 py-3 px-3 bg-danger border-danger text-center">
                                <span className="text-white fw-bold fs-6">
                                    Nem található rendelés!
                                </span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-4">
                                {groupedOrders.map((order) => {
                                    const currentSelectedStatus =
                                        editedStatuses[order.order_id] ?? order.order_status;

                                    const hasChanges =
                                        currentSelectedStatus !== order.order_status;

                                    return (
                                        <div
                                            key={order.order_id}
                                            className="bg-danger border border-light rounded-4 p-3 p-md-4 shadow-sm"
                                        >
                                            <div className="row g-3 mb-3">
                                                <div className="col-12 col-md-6 col-xl-3">
                                                    <div className="fw-semibold text-light">Rendelés azonosító:</div>
                                                    <div className="text-dark fw-bold">#{order.order_id}</div>
                                                </div>

                                                <div className="col-12 col-md-6 col-xl-3">
                                                    <div className="fw-semibold text-light">Felhasználó ID:</div>
                                                    <div className="text-dark fw-bold">{order.user_id}</div>
                                                </div>

                                                <div className="col-12 col-md-6 col-xl-3">
                                                    <div className="fw-semibold text-light">Felhasználónév:</div>
                                                    <div className="text-dark fw-bold text-break">{order.user_username}</div>
                                                </div>

                                                <div className="col-12 col-md-6 col-xl-3">
                                                    <div className="fw-semibold text-light">Rendelés dátuma:</div>
                                                    <div className="text-dark fw-bold">
                                                        {new Date(order.order_date).toLocaleString("hu-HU")}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row g-3 mb-4">
                                                <div className="col-12 col-md-6">
                                                    <div className="fw-semibold text-light mb-1">Jelenlegi státusz:</div>
                                                    <span className={`badge ${getStatusBadgeClass(order.order_status)} fs-6`}>
                                                        {translateStatus(order.order_status)}
                                                    </span>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="fw-semibold text-light mb-1">Végösszeg:</div>
                                                    <div className="text-dark fw-bold">
                                                        {order.total.toLocaleString("hu-HU")} Ft
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="fw-semibold text-light mb-2">Rendelt termékek:</div>

                                                <div className="d-flex flex-column gap-3">
                                                    {order.items.map((item, index) => (
                                                        <div
                                                            key={`${order.order_id}-${item.product_id}-${index}`}
                                                            className="bg-light rounded-4 p-3 border"
                                                        >
                                                            <div className="row g-3 align-items-center">
                                                                <div className="col-12 col-md-3 col-xl-2">
                                                                    {item.product_image ? (
                                                                        <img
                                                                            src={getImageSrc(item.product_image)}
                                                                            alt={item.product_name}
                                                                            className="img-fluid rounded-3 border"
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "120px",
                                                                                objectFit: "cover"
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="border rounded-3 d-flex align-items-center justify-content-center bg-white text-muted"
                                                                            style={{ height: "120px" }}>
                                                                            Nincs kép
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="col-12 col-md-9 col-xl-10">
                                                                    <div className="row g-2">
                                                                        <div className="col-12 col-md-6 col-xl-3">
                                                                            <div className="fw-semibold">Termék neve:</div>
                                                                            <div className="text-break">{item.product_name}</div>
                                                                        </div>

                                                                        <div className="col-12 col-md-6 col-xl-2">
                                                                            <div className="fw-semibold">Termék ID:</div>
                                                                            <div>{item.product_id}</div>
                                                                        </div>

                                                                        <div className="col-12 col-md-4 col-xl-2">
                                                                            <div className="fw-semibold">Egységár:</div>
                                                                            <div>{item.product_price.toLocaleString("hu-HU")} Ft</div>
                                                                        </div>

                                                                        <div className="col-12 col-md-4 col-xl-2">
                                                                            <div className="fw-semibold">Darabszám:</div>
                                                                            <div>{item.order_count} db</div>
                                                                        </div>

                                                                        <div className="col-12 col-md-4 col-xl-3">
                                                                            <div className="fw-semibold">Összesen:</div>
                                                                            <div>{item.item_total.toLocaleString("hu-HU")} Ft</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="row g-3 align-items-end">
                                                <div className="col-12 col-lg-6">
                                                    <label className="form-label text-light fw-semibold">
                                                        Új rendelési státusz:
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        value={currentSelectedStatus}
                                                        onChange={(e) =>
                                                            handleStatusSelect(order.order_id, e.target.value)
                                                        }
                                                    >
                                                        <option value="shipping">Szállítás alatt</option>
                                                        <option value="delivered">Kiszállítva</option>
                                                        <option value="cancelled">Törölve</option>
                                                    </select>
                                                </div>

                                                <div className="col-12 col-lg-6">
                                                    <button
                                                        className="btn btn-warning fw-bold w-100"
                                                        onClick={() => handleSaveStatus(order.order_id)}
                                                        disabled={!hasChanges || savingOrderId === order.order_id}
                                                    >
                                                        {savingOrderId === order.order_id ? "Mentés..." : "Státusz mentése"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}