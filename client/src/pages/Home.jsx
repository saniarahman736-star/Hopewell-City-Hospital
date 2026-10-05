import {NavLink} from "react-router-dom";
export const Home=() =>{
    return (
        <>
         <div style={{
            backgroundImage:"url('/images/doctorpic14.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        <section className="hero">
            <div className="container grid grid-two-cols">
            <div className="hero-text">
                <h1>Our Expertise At Your Service</h1>
                <br/>
                <p>We are committed to providing compassionate, high-quality healthcare with a
                     patient-first approach. Our team of experienced doctors, skilled nurses, and 
                     dedicated healthcare professionals works around the clock to ensure every patient receives 
                     the best possible care in a safe and comfortable environment.
                <br/>
                 With advanced medical technology, modern facilities, and a focus on excellence,
                  we offer comprehensive healthcare services across multiple specialties. Your health, comfort, 
                  and well-being are at the heart of everything we do.
                </p>
                <br/>
                <div className="btn-group">
                    <NavLink to="/about">
                    <button className="btn-connect-btn">
                        Get To Know Us
                    </button>
                    </NavLink>
                    <NavLink to="/contact">
                    <button className="btn-connect-btn">
                        Connect With Us
                    </button>
                    </NavLink>
                </div>
                </div>
                <div className="image-portion">
                    <img src="/images/doctorpic13.jpg"
                    alt="a picture"/>
                </div>
                </div>
        </section>
         </div>
         <section className="services">
          <h2>Our Services</h2>
          <div className="service-container">
            <div className="card">
                <h3>Cardiology</h3>
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic8.jpg"
                    alt="a cardio doctor"/>
                </div>
                <p>Advanced heart care and expert cardiac consultations for a healthier life.</p>
            </div>
            <div className="card">
                <h3>Neurology</h3>
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic9.jpg"
                    alt="a neuro doctor"/>
                </div>
                <p>Specialized care for brain, spine, and nervous system health.</p>
            </div>
            <div className="card">
                <h3>Orthopedics</h3>
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic10.jpg"
                    alt="a ortho doctor"/>
                </div>
                <p>Complete care for bones, joints, muscles, and mobility issues.</p>
            </div>
            <div className="card">
                <h3>Pediatrics</h3>
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic11.jpg"
                    alt="a childspecialist "/>
                </div>
                <p>"Compassionate healthcare solutions for your child's growth and wellness."</p>
            </div>
            <div className="card">
                <h3>Gynecology</h3> 
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic15.jpg"
                    alt="a gynaeo doctor"/>
                </div>
                <p>Comprehensive women's healthcare services covering reproductive health, pregnancy care,
                     hormonal concerns, and overall wellness.
               </p>
            </div>
            <div className="card">
                <h3>Endocrinology</h3> 
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic19.jpeg"
                    alt="an endocrine doctor"/>
                </div>
                <p>"Comprehensive care for diabetes, hormonal imbalances, and endocrine disorders."
               </p>
            </div>
            <div className="card">
                <h3>Nephrology</h3> 
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic17.jpg"
                    alt="a kidney doctor"/>
                </div>
                <p>"Expert care for kidney health, dialysis, and treatment of kidney-related disorders."
               </p>
            </div>
            <div className="card">
                <h3>General Physician</h3> 
                <br/>
                <div className="picture">
                    <img src="/images/doctorpic18.jpg"
                    alt="a general phyiscian"/>
                </div>
                <p>"Primary healthcare services for diagnosis, treatment, and preventive care for all ages."
               </p>
            </div>
          </div>
         </section>
           <section className="why">
            <h2>Why Choose Us?</h2>
            <div className="why-container">
                <div>Experienced Doctors</div>
                <div>24/7 Emergency Service</div>
                <div>Modern Equipments</div>
                <div>Online Appointments</div>
            </div>
           </section>
           <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
           </footer>

         </>
    )
}