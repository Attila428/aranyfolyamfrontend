const BACKEND_URL = "http://192.168.9.113:4000"
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
    }
}

export async function deleteUser(user_id) {
    try {
        console.log(user_id);
        const res = await fetch(`${BACKEND_URL}/admin/delete/user/${user_id}`, {
            method: "DELETE",
            credentials: "include"
        })
        console.log(res);
        const data = await res.json()
        return data.result
    } catch (err) {
        console.error(err)
    }
}

export async function editUser(user_id, user_username,user_email,user_role) {
    try {     
        const res = await fetch(`${BACKEND_URL}/admin/update/user/${user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_username,user_email,user_role}),
            credentials: "include"
        });
        // console.log("a");
        console.log(user_username,user_email,user_role);
        return await res.json();
    } catch (err) {
        console.log(err)
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
    }
}