import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../api/api";
import { Navigate } from "react-router-dom";

export default function UserOrders() {
    const { user, loading, errorUser, onLogout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [ordersError, setOrdersError] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            if (!user?.user_id) return;

            const data = await getUserOrders(user.user_id);

            if (data?.error) {
                setOrdersError(data.error);
                setOrders([]);
                return;
            }

            setOrdersError("");
            setOrders(data || []);
        }

        if (!loading && user?.user_id) {
            fetchOrders();
        }
    }, [user, loading]);

    const groupedOrders = useMemo(() => {
        const grouped = {};

        for (const row of orders) {
            if (!grouped[row.order_id]) {
                grouped[row.order_id] = {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    order_status: row.order_status,
                    user_username: row.user_username,
                    items: [],
                    total: 0
                };
            }

            const itemTotal = Number(row.product_price) * Number(row.order_count);

            grouped[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                product_price: Number(row.product_price),
                order_count: Number(row.order_count),
                item_total: itemTotal
            });

            grouped[row.order_id].total += itemTotal;
        }

        return Object.values(grouped);
    }, [orders]);

    if (loading) {
        return <p className="text-center mt-5">Töltés...</p>;
    }

    if (!loading && !user) {
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
                    <h1 className="text-white text-center mb-3 mb-md-4">
                        Rendeléseim
                    </h1>

                    {errorUser && (
                        <div className="alert alert-danger text-center">
                            {errorUser}
                        </div>
                    )}

                    {ordersError && (
                        <div className="alert alert-danger text-center">
                            {ordersError}
                        </div>
                    )}

                    {!ordersError && groupedOrders.length === 0 && (
                        <div className="border border-2 rounded-4 py-3 px-3 bg-danger border-danger text-center">
                            <span className="text-white fw-bold">
                                Nincs még rendelésed!
                            </span>
                        </div>
                    )}

                    <div className="d-flex flex-column gap-3 gap-md-4">
                        {groupedOrders.map((order) => (
                            <div
                                key={order.order_id}
                                className="card shadow border-0 rounded-4 overflow-hidden"
                            >
                                <div className="card-body p-3 p-md-4">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
                                        <div className="w-100">
                                            <h4 className="mb-2">Rendelés #{order.order_id}</h4>
                                            <div className="d-flex flex-column gap-1 small">
                                                <span className="text-muted">
                                                    Dátum: {new Date(order.order_date).toLocaleString("hu-HU")}
                                                </span>
                                                <span>
                                                    <strong>Státusz:</strong> {order.order_status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-100 w-md-auto text-start text-md-end">
                                            <div className="fw-bold">
                                                Végösszeg: {order.total.toLocaleString("hu-HU")} Ft
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-block d-md-none">
                                        <div className="d-flex flex-column gap-3">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={`${order.order_id}-${item.product_id}-${index}`}
                                                    className="border rounded-4 p-3 bg-light"
                                                >
                                                    <div className="fw-bold mb-2">
                                                        {item.product_name}
                                                    </div>

                                                    <div className="d-flex flex-column gap-1 small">
                                                        <div className="d-flex justify-content-between">
                                                            <span>Egységár</span>
                                                            <span>{item.product_price.toLocaleString("hu-HU")} Ft</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <span>Darab</span>
                                                            <span>{item.order_count}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between fw-bold pt-1 border-top mt-1">
                                                            <span>Összesen</span>
                                                            <span>{item.item_total.toLocaleString("hu-HU")} Ft</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-none d-md-block">
                                        <div className="table-responsive">
                                            <table className="table align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Termék</th>
                                                        <th>Egységár</th>
                                                        <th>Darab</th>
                                                        <th>Összesen</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item, index) => (
                                                        <tr key={`${order.order_id}-${item.product_id}-${index}`}>
                                                            <td>{item.product_name}</td>
                                                            <td>{item.product_price.toLocaleString("hu-HU")} Ft</td>
                                                            <td>{item.order_count}</td>
                                                            <td>{item.item_total.toLocaleString("hu-HU")} Ft</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}