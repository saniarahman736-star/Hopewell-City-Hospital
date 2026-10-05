import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        cart = [],
        subtotal = 0,
        deliveryFee = 0,
        total = 0
    } = location.state || {};

    const placeOrder = () => {
        toast.success("Order placed successfully! 🎉");

        setTimeout(() => {
            navigate("/patient/dashboard");
        }, 1200);
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <div>🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add medicines before proceeding to checkout.</p>

                    <button onClick={() => navigate("/medications")}>
                        💊 Browse Medicines
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            {/* HEADER */}

            <header className="checkout-header">
                <div>
                    <h2>✚ HopeWell City Hospital</h2>
                    <p>HopeWell Pharmacy</p>
                </div>

                <button onClick={() => navigate("/medications")}>
                    ← Back to Pharmacy
                </button>
            </header>

            {/* CONTENT */}

            <main className="checkout-container">

                <div className="checkout-title">
                    <h1>Checkout</h1>
                    <p>Complete your order</p>
                </div>

                <div className="checkout-grid">

                    {/* LEFT */}

                    <section className="checkout-left">

                        {/* ADDRESS */}

                        <div className="checkout-card">

                            <div className="card-title">
                                <span>🏠</span>
                                <div>
                                    <h3>Delivery Address</h3>
                                    <p>Where should we deliver your medicines?</p>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Full Name"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                            />

                            <textarea
                                placeholder="Delivery Address"
                                rows="3"
                            ></textarea>

                            <div className="address-row">
                                <input
                                    type="text"
                                    placeholder="City"
                                />

                                <input
                                    type="text"
                                    placeholder="PIN Code"
                                />
                            </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="checkout-card">

                            <div className="card-title">
                                <span>💳</span>

                                <div>
                                    <h3>Payment Method</h3>
                                    <p>Select your preferred payment option</p>
                                </div>
                            </div>

                            <label className="payment-option">

                                <input
                                    type="radio"
                                    name="payment"
                                    defaultChecked
                                />

                                <div>
                                    <strong>💵 Cash on Delivery</strong>
                                    <p>Pay when your order arrives</p>
                                </div>

                            </label>

                        </div>

                    </section>

                    {/* RIGHT */}

                    <aside className="order-summary">

                        <h2>📦 Order Summary</h2>

                        <div className="summary-items">

                            {cart.map((item) => (

                                <div
                                    className="summary-item"
                                    key={item._id}
                                >

                                    <div className="summary-image">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                        ) : (
                                            "💊"
                                        )}
                                    </div>

                                    <div className="summary-info">
                                        <h4>{item.name}</h4>

                                        <span>
                                            Qty: {item.quantity}
                                        </span>
                                    </div>

                                    <strong>
                                        ₹{item.price * item.quantity}
                                    </strong>

                                </div>

                            ))}

                        </div>

                        <div className="summary-prices">

                            <div>
                                <span>Subtotal</span>
                                <strong>₹{subtotal}</strong>
                            </div>

                            <div>
                                <span>Delivery</span>
                                <strong>
                                    {deliveryFee === 0
                                        ? "FREE"
                                        : `₹${deliveryFee}`}
                                </strong>
                            </div>

                            <hr />

                            <div className="final-total">
                                <span>Total</span>
                                <strong>₹{total}</strong>
                            </div>

                        </div>

                        <button
                            className="place-order-button"
                            onClick={placeOrder}
                        >
                            ✅ Place Order
                        </button>

                        <p className="secure-note">
                            🔒 Your order details are secure
                        </p>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default Checkout;