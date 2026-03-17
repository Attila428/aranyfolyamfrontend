const BACKEND_URL = "http://192.168.9.113:4000/admin"
export async function getUsers() {
    try {
        const res = await fetch(`${BACKEND_URL}/users`, {
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
        const res = await fetch(`${BACKEND_URL}/delete/user/${user_id}`, {
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