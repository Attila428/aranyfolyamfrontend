# 🎨 AranyFolyam Frontend

## 🗒️ Tartalomjegyzék

* [Bevezetés](#bevezetés)
* [Projekt szerkezet](#projekt-szerkezet)
* [Fő funkciók](#fő-funkciók)
* [Állapotkezelés](#állapotkezelés)
* [API kommunikáció](#api-kommunikáció)
* [Telepítés](#telepítés)
* [Használat](#használat)
* [Oldalak](#oldalak)
* [Komponensek](#komponensek)
* [Technológiai stack](#technológiai-stack)
* [Fejlesztési lehetőségek](#fejlesztési-lehetőségek)

---

## 🏪 Bevezetés

Az **AranyFolyam Frontend** egy React alapú webalkalmazás, amely a zálogház backend rendszerhez készült felhasználói felületet biztosít.

A frontend lehetővé teszi:

* Felhasználók regisztrációját és bejelentkezését  
* Termékek (zálogtárgyak) böngészését  
* Rendelések (zálog ügyletek) kezelését  
* Admin felület használatát  
* Profil adatok megtekintését  

A rendszer REST API-n keresztül kommunikál a backenddel.

---

## 📁 Projekt szerkezet

```text
├── public/
├── src/
│   ├── api/
│   │   └── api.js
│   ├── assets/
│   │   ├── aranyfolyamlogo.png
│   │   └── react.svg
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── EditUserByAdmin.jsx
│   │   ├── Footer.jsx
│   │   ├── InputField.jsx
│   │   ├── NavBar.jsx
│   │   ├── Product.jsx
│   │   └── User.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AboutUsPage.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── Profil.jsx
│   │   ├── RegisterPage.jsx
│   │   └── UserOrders.jsx
│   ├── inputfield.css
│   ├── main.jsx
│   └── users.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Fő funkciók

### 👤 Felhasználók
- Regisztráció és bejelentkezés  
- Profil megtekintése  
- Saját rendelések listázása  

### 📦 Termékek
- Termékek megjelenítése  
- Részletes termék nézet  
- Admin által kezelhető (CRUD)  

### 🛒 Rendelések
- Rendelések létrehozása  
- Saját rendelések követése  
- Admin rendeléskezelés  

### 🔐 Admin funkciók
- Felhasználók kezelése  
- Termékek kezelése  
- Rendelések áttekintése  

---

## 🧠 Állapotkezelés

A projekt **React Context API-t** használ.

### 📌 AuthContext
- felhasználó adatok tárolása  
- JWT token kezelése  
- bejelentkezési állapot  

Ez globális state-ként működik az egész alkalmazásban.

---

## 🔌 API kommunikáció

Az API hívások a következő fájlban találhatók:

```text
src/api/api.js
```

Feladata:
- HTTP kérések kezelése (GET, POST, PUT, DELETE)  
- backend endpointok elérése  
- token továbbítása  

A frontend a backend REST API-hoz kapcsolódik.

---

## ⬇️ Telepítés

1. Klónozd a projektet:

```bash
git clone <frontend-repo-link>
```

2. Lépj be a mappába:

```bash
cd sajatfrontend
```

3. Függőségek telepítése:

```bash
npm install
```

---

## 🛍️ Használat

Fejlesztői mód:

```bash
npm run dev
```

[Alapértelmezett cím](https://aranyfolyam.netlify.app/#/)
---
Teszt felhasználók :

User : 
Email : userbemutato@gmail.com
Jelszó : userbemutato

Admin : 
Email : adminbemutato@gmail.com
Jelszó : adminbemutato


---

## 📄 Oldalak

| Oldal | Leírás |
|---|---|
| LoginPage | Bejelentkezés |
| RegisterPage | Regisztráció |
| ProductPage | Termékek listázása |
| Profil | Felhasználói profil |
| UserOrders | Saját rendelések |
| AdminPanel | Admin dashboard |
| AdminProducts | Termék kezelés |
| AdminOrders | Rendelések kezelése |
| AboutUsPage | Információs oldal |

---

## 🧩 Komponensek

| Komponens | Leírás |
|---|---|
| NavBar | Navigáció |
| Footer | Lábléc |
| Product | Termék megjelenítés |
| User | Felhasználó megjelenítés |
| Button | Újrahasználható gomb |
| InputField | Input mezők |
| EditUserByAdmin | Admin user szerkesztés |

---

## 📌 Technológiai stack

* React  
* Vite  
* JavaScript (ES6+)  
* Context API  
* CSS  

---

---
[Figma tervek](https://www.figma.com/design/A2r6P55fo5dbs4IYvBL5Bz/Untitled?node-id=0-1&p=f&t=BSUzRqEVZM73paV8-0)
---


## 🚀 Fejlesztési lehetőségek

* 🔍 Keresés és szűrés fejlesztése  
* 📱 Reszponzív design javítása  
* 🔐 Role-based route védelem bővítése  
* 📊 Dashboard statisztikák  
* 🌐 Többnyelvű támogatás  
* ⚡ Performance optimalizálás  
* 🎨 UI/UX fejlesztés  