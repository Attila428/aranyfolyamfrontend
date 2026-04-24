export async function register(user_email, user_username, user_psw) {
    const res = await fetch(`/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_email, user_username, user_psw })
    })

    console.log(res)
    const data = await res.json()
    console.log(data)
    return data
}

export async function login(user_email, user_psw) {
    const res = await fetch(`/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ user_email, user_psw })
    })

    //console.log(res)
    const data = await res.json()
    //console.log(data)
    return data
}



// whoami

export async function whoami() {
    const res = await fetch(`/whoami`,{
        method: 'GET',
        credentials : 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return {error : data?.error}
    }

    return await res.json()
}

// logout   

export async function logout() {
    const res = await fetch(`/logout`, {
        method: 'POST',
        credentials: 'include',
    })

    //console.log(res)
    const data = await res.json()
    //console.log(data)
    return data
}

export async function updateProfile({ username, email, psw }) {
  const res = await fetch(`/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      user_username: username,
      user_email: email,
      user_psw: psw
    })
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.error };
  }

  return data;
}
