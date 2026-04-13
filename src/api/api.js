const BACKEND_URL = ""

export async function getUsers() {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users`, {
            method: "GET",
            credentials: "include"
        })

        const data = await res.json()
        return data.result
    } catch (err) {
        console.error(err)
        return { error: "Nem sikerült lekérni a usereket." }
    }
}

export async function deleteUser(user_id) {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/delete/user/${user_id}`, {
            method: "DELETE",
            credentials: "include"
        })

        const data = await res.json()
        return data.result
    } catch (err) {
        console.error(err)
        return { error: "Nem sikerült törölni a usert." }
    }
}

export async function editUser(user_id, user_username, user_email, user_role) {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/update/user/${user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_username, user_email, user_role }),
            credentials: "include"
        })

        return await res.json()
    } catch (err) {
        console.error(err)
        return { error: "Nem sikerült módosítani a usert." }
    }
}

export async function getAllProduct() {
    try {
        const res = await fetch(`${BACKEND_URL}/product/all`, {
            method: "GET",
            credentials: "include"
        })

        const data = await res.json()
        return data.result
    } catch (err) {
        console.error(err)
        return { error: "Nem sikerült lekérni a termékeket." }
    }
}

export async function createOrder(user_id, items) {
    try {
        const res = await fetch(`${BACKEND_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, items }),
            credentials: "include"
        });

        const data = await res.json(); // Egyszerűbb JSON kezelés

        if (!res.ok) {
            return { error: data.error || "Sikertelen rendelés." };
        }

        return data; // Ez már a parsed objektum
    } catch (err) {
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function getUserOrders(user_id) {
    try {
        const res = await fetch(`${BACKEND_URL}/orders/${user_id}`, {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült lekérni a rendeléseket." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function getAllOrders() {
    try {
        const res = await fetch(`${BACKEND_URL}/orders`, {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült lekérni a rendeléseket." };
        }

        return Array.isArray(data) ? data : data.result || [];
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function updateOrderStatus(order_id, status) {
    try {
        const res = await fetch(`${BACKEND_URL}/orders/${order_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status }),
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült frissíteni a rendelés státuszát." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function createProduct(product) {
    try {
        const res = await fetch(`${BACKEND_URL}/product/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product),
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült létrehozni a terméket." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function updateProduct(product) {
    try {
        const res = await fetch(`${BACKEND_URL}/product/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product),
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült módosítani a terméket." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function deleteProduct(product_id) {
    try {
        const res = await fetch(`${BACKEND_URL}/product/del/${product_id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            return { error: data.error || "Nem sikerült törölni a terméket." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}