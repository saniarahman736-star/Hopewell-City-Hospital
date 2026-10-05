import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "./Medications.css";
const Medications=()=>{
    const navigate=useNavigate();
    const [medicines,setMedicines]=useState([]);
    const [cart,setCart]=useState([]);
    const [loading,setLoading]=useState(true);
    const [search,setSearch]=useState("");
    const [category,setCategory]=useState("All");
    useEffect(()=>{
        const getMedicines=async()=>{
            try{
              const response=await fetch(
                "http://localhost:5000/api/medicines"
              );
              const data=await response.json();
              if(response.ok){
                setMedicines(data.data || []);
              } else {
                setMedicines([]);
              }
            }catch(error){
               console.log("Medicines error:",error);
               toast.error("Unable to load medicines");
            } finally {
                setLoading(false);
            }
        };
        getMedicines();
    },[]);
    const categories=[
        "All",
        ...new Set(medicines.map((medicine)=>medicine.category).filter(Boolean))
    ];
    const filteredMedicines=medicines.filter((medicine)=>{
        const matchesSearch=medicine.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory=
          category === "All" ||
          medicine.category === category;
        return matchesSearch && matchesCategory;
    });
    const addToCart=(medicine)=>{
        if(medicine.prescriptionRequired){
            toast.info(
                "Prescription is required for this medicine"
            );
            return;
        }
    setCart((currentCart)=>{
        const existing=currentCart.find(
            (item)=>item._id === medicine._id
        );
        if(existing){
            return currentCart.map((item)=>
            item._id === medicine._id ? {
                ...item,
                quantity:Math.min(
                    item.quantity+1,
                    medicine.stock
                )
            }:item)
        }
        return [
            ...currentCart,
            {
                ...medicine,
                quantity:1,
            },
        ]
    });
    toast.success(`${medicine.name} added to cart`);
    };
    const updateQuantity=(id,change)=>{
        setCart((currentCart)=>
        currentCart
          .map((item)=>{
            if(item._id !== id)
                return item;
            const newQuantity=item.quantity+change;
            return {
                ...item,
                quantity:newQuantity,
            };
          })
        .filter((item)=>item.quantity>0))
    }
    const removeFromCart=(id)=>{
        setCart((currentCart)=>
        currentCart.filter(
            (item)=>item._id !== id
        ));
    };
    const clearCart=()=>{
        setCart([]);
    };
    const subtotal=cart.reduce(
        (total,item)=>total+item.price*item.quantity,
        0
    );
    const deliveryFee=
      subtotal === 0?0:subtotal>=500?0:20;
    const total=subtotal+deliveryFee;
    const cartCount=cart.reduce(
        (total,item)=>total+item.quantity,
        0
    );
    return (
        <div className="medications-page">

            {/* HEADER */}

            <header className="pharmacy-header">

                <div className="hospital-brand">
                    <div className="hospital-icon">
                        ✚
                    </div>

                    <div>
                        <h2>HopeWell City Hospital</h2>
                        <p>
                            Better Health • Brighter Tomorrow
                        </p>
                    </div>
                </div>

                <div className="pharmacy-user">
                    👤
                    <span>Hello, Patient</span>
                </div>

            </header>

            {/* PHARMACY HERO */}

            <section className="pharmacy-hero">

                <div className="hero-content">

                    <div className="pharmacy-title">
                        <span>💊</span>

                        <div>
                            <h1>
                                HopeWell Pharmacy
                            </h1>

                            <p>
                                Medicines & Healthcare Essentials
                            </p>
                        </div>
                    </div>

                    <div className="search-box">

                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search medicines..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

                <div className="hero-message">
                    <div className="medicine-illustration">
                        💊 🧴
                    </div>

                    <h3>Your Health</h3>
                    <strong>Our Priority</strong>
                </div>

            </section>

            {/* CATEGORY FILTERS */}

            <div className="category-container">

                {categories.map((item) => (
                    <button
                        key={item}
                        className={
                            category === item
                                ? "category-button active"
                                : "category-button"
                        }
                        onClick={() =>
                            setCategory(item)
                        }
                    >
                        {item === "All" && "✦ "}
                        {item}
                    </button>
                ))}

            </div>

            {/* MAIN CONTENT */}

            <main className="pharmacy-content">

                {/* MEDICINES */}

                <section className="medicine-section">

                    <div className="section-heading">

                        <h2>
                            Available Medicines
                        </h2>

                        <span>
                            Total {filteredMedicines.length} medicines
                        </span>

                    </div>

                    {loading ? (

                        <div className="medicine-message">
                            <div>💊</div>
                            <h2>
                                Loading medicines...
                            </h2>
                        </div>

                    ) : filteredMedicines.length === 0 ? (

                        <div className="medicine-message">
                            <div>🔍</div>
                            <h2>
                                No medicines found
                            </h2>
                            <p>
                                Try another medicine or category.
                            </p>
                        </div>

                    ) : (

                        <div className="medicine-grid">

                            {filteredMedicines.map(
                                (medicine) => (

                                    <div
                                        className="medicine-card"
                                        key={medicine._id}
                                    >

                                        <div className="medicine-image">

                                            {medicine.image ? (
                                                <img
                                                    src={medicine.image}
                                                    alt={medicine.name}
                                                />
                                            ) : (
                                                <span>
                                                    💊
                                                </span>
                                            )}

                                        </div>

                                        <span className="medicine-category">
                                            {medicine.category}
                                        </span>

                                        <h3>
                                            {medicine.name}
                                        </h3>

                                        <p className="medicine-description">
                                            {medicine.description ||
                                                "Healthcare medicine from HopeWell Pharmacy."}
                                        </p>

                                        <div className="medicine-price-row">

                                            <strong>
                                                ₹{medicine.price}
                                            </strong>

                                            <span
                                                className={
                                                    medicine.stock > 0
                                                        ? "in-stock"
                                                        : "out-stock"
                                                }
                                            >
                                                ●{" "}
                                                {medicine.stock > 0
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </span>

                                        </div>

                                        {medicine.prescriptionRequired && (
                                            <div className="prescription-required">
                                                🔒 Prescription Required
                                            </div>
                                        )}

                                        <div className="medicine-actions">

                                            <div className="quantity-box">
                                                <button
                                                    onClick={() =>
                                                        toast.info(
                                                            "Add the medicine to cart first."
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>1</span>

                                                <button
                                                    onClick={() =>
                                                        toast.info(
                                                            "Add the medicine to cart first."
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="add-cart-button"
                                                disabled={
                                                    medicine.stock <= 0
                                                }
                                                onClick={() =>
                                                    addToCart(
                                                        medicine
                                                    )
                                                }
                                            >
                                                🛒 Add to Cart
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* CART */}

                <aside className="cart-sidebar">

                    <div className="cart-header">

                        <h2>
                            🛒 My Cart
                            <span>
                                {cartCount}
                            </span>
                        </h2>

                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="clear-cart"
                            >
                                🗑 Clear Cart
                            </button>
                        )}

                    </div>

                    {cart.length === 0 ? (

                        <div className="empty-cart">

                            <div>🛒</div>

                            <h3>
                                Your cart is empty
                            </h3>

                            <p>
                                Add medicines to your cart
                                to continue.
                            </p>

                        </div>

                    ) : (

                        <>
                            <div className="cart-items">

                                {cart.map((item) => (

                                    <div
                                        className="cart-item"
                                        key={item._id}
                                    >

                                        <div className="cart-item-image">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                            ) : (
                                                "💊"
                                            )}
                                        </div>

                                        <div className="cart-item-info">

                                            <button
                                                className="remove-item"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item._id
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                            <h4>
                                                {item.name}
                                            </h4>

                                            <strong>
                                                ₹{item.price}
                                            </strong>

                                            <div className="cart-quantity">

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            <div className="cart-summary">

                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹{subtotal}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Delivery Fee
                                    </span>

                                    <strong>
                                        {deliveryFee === 0
                                            ? "FREE"
                                            : `₹${deliveryFee}`}
                                    </strong>
                                </div>

                                <hr />

                                <div className="cart-total">
                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹{total}
                                    </strong>
                                </div>

                                <button
    className="checkout-button"
    onClick={() =>
        navigate("/checkout", {
            state: {
                cart,
                subtotal,
                deliveryFee,
                total
            }
        })
    }
>
    🔒 Proceed to Checkout
</button>

                                <div className="delivery-note">
                                    🚚
                                    <div>
                                        <strong>
                                            Free delivery
                                        </strong>

                                        <p>
                                            On orders above ₹500
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </>

                    )}

                </aside>

            </main>

            {/* FOOTER */}

            <footer className="pharmacy-footer">
                <p>
                    © 2026 HopeWell City Hospital.
                    All Rights Reserved.
                </p>

                <span>
                    Healthy People • Healthy Community •
                    A Healthier Tomorrow
                </span>
            </footer>

        </div>
    );
};

export default Medications;
