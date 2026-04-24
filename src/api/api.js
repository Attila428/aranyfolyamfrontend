const BACKEND_URL = "https://nodejs213.dszcbaross.edu.hu"; 

async function parseJsonSafe(res) {
    try {
        return await res.json();
    } catch {
        return {};
    }
}

export async function getUsers() {
    try {
        const res = await fetch(`/admin/users`, {
            method: "GET",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Nem sikerült lekérni a usereket." };
        }

        return data.result || [];
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült lekérni a usereket." };
    }
}

export async function deleteUser(user_id) {
    try {
        const res = await fetch(`/admin/delete/user/${user_id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Nem sikerült törölni a usert." };
        }

        return data.result || data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült törölni a usert." };
    }
}

export async function editUser(user_id, user_username, user_email, user_role) {
    try {
        const res = await fetch(`/admin/update/user/${user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_username, user_email, user_role }),
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Nem sikerült módosítani a usert." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült módosítani a usert." };
    }
}

export async function getAllProduct() {
    try {
        const res = await fetch(`/product/all`, {
            method: "GET",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Nem sikerült lekérni a termékeket." };
        }

        return data.result || [];
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült lekérni a termékeket." };
    }
}

export async function createOrder(user_id, items) {
    try {
        const res = await fetch(`/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id, items }),
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Sikertelen rendelés." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function getUserOrders(user_id) {
    try {
        const res = await fetch(`/orders/${user_id}`, {
            method: "GET",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

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
        const res = await fetch(`/orders`, {
            method: "GET",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

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
        const res = await fetch(`/orders/${order_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status }),
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return {
                error:
                    data.error || "Nem sikerült frissíteni a rendelés státuszát."
            };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}

export async function createProduct(product) {
    try {
        const formData = new FormData();

        formData.append("category_id", product.category_id ?? "");
        formData.append("product_name", product.product_name ?? "");
        formData.append("product_price", product.product_price ?? "");
        formData.append("product_stock", product.product_stock ?? "");

        if (product.product_image instanceof File) {
            formData.append("product_image", product.product_image);
        }

        const res = await fetch(`/product/add`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

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
        const formData = new FormData();

        formData.append("product_id", product.product_id ?? "");
        formData.append("category_id", product.category_id ?? "");
        formData.append("product_name", product.product_name ?? "");
        formData.append("product_price", product.product_price ?? "");
        formData.append("product_stock", product.product_stock ?? "");

        if (product.product_image instanceof File) {
            formData.append("product_image", product.product_image);
        }

        const res = await fetch(`/product/update`, {
            method: "PUT",
            body: formData,
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

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
        const res = await fetch(`/product/del/${product_id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await parseJsonSafe(res);

        if (!res.ok) {
            return { error: data.error || "Nem sikerült törölni a terméket." };
        }

        return data;
    } catch (err) {
        console.error(err);
        return { error: "Nem sikerült kapcsolódni a szerverhez." };
    }
}