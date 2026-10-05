
export const About=() =>{
    return (
        <>
        <div style={{
            backgroundImage:"url('/images/doctorpic36.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        <div className="about-section">
            <h1>Welcome To HopeWell City Hospital</h1>
            <br/>
            <ul>
                <li>Compassion</li>
                <li>Care</li>
                <li>Excellence</li>
            </ul>
            <p>We are dedicated to providing world-class healthcare with experienced doctors and 
            modern medical facilities.  
            </p>
        <div className="about-text">
             <p>HopeWell City Hospital is a trusted healthcare institution dedicated to providing 
                compassionate, affordable, and high-quality medical care to every patient. 
                <br/>
                With a team of experienced doctors, skilled nurses, and dedicated healthcare professionals,
                we strive to deliver personalized treatment using advanced medical technology and modern
                healthcare practices.
                <br/>
                Our hospital offers a wide range of services, including emergency care,
                specialist consultations, diagnostic facilities, preventive healthcare, and
                patient-centered treatment across multiple medical departments. 
                <br/>
                At HopeWell City Hospital,we believe that every patient deserves respect, dignity, and the 
                highest standard of care.
                Our commitment to excellence, innovation, and continuous improvement enables us to create
                a safe, comfortable, and healing environment where patients and their families can place
                their complete trust. By combining medical expertise with compassion and integrity,
                we aim to improve the health and well-being of our community while building lasting
                relationships based on trust, care, and exceptional healthcare services.
            </p>
        </div>
        </div>
        </div>
        <div className="about-info">
            <h1>Meet Our Doctors</h1>
            <div className="doctor-pictures">
                <div className="doctor-row">
                <div className="card-section">
                    <p>Dr Vikram Singh</p>
                    <img src="/images/doctorpic30.webp"
                    alt="doctor1 picture"
                    />
                    <p>Specialization:Neurology</p>
                    
                    <p>Qualification:MBBS MD(Neurology)</p>
                    
                    <p>Experience:12</p>
                </div>
                <div className="card-section">
                    <p>Dr Shreya Basu</p>
                    <img src="/images/doctorpic40.jpg"
                    alt="doctor2 picture"
                    />
                    <p>Specialization:Cardiology</p>
                    
                    <p>Qualification:MBBS MS(Cardiology)</p>
                    
                    <p>Experience:15</p>
                </div>
                <div className="card-section">
                    <p>Dr Abhisekh Roy</p>
                    <img src="/images/doctorpic41.jpg"
                    alt="doctor3 picture"
                    />
                    <p>Specialization:Orthopedics</p>
                    
                    <p>Qualification:MBBS MD(Orthopedics)</p>
                    
                    <p>Experience:14</p>
                </div>
                <div className="card-section">
                    <p>Dr Kunal Verma</p>
                    <img src="/images/doctorpic32.jpg"
                    alt="doctor4 picture"
                    />
                    <p>Specialization:Nephrology</p>
                    
                    <p>Qualification:MBBS MS(Nephrology)</p>
                    
                    <p>Experience:10</p>
                </div>
                </div>
                <div className="doctor-row center-row">
                <div className="card-section">
                    <p>Dr Soumya Dutta</p>
                    <img src="/images/doctorpic35.webp"
                    alt="doctor5 picture"
                    />
                    <p>Specialization:Endocrinology</p>
                    
                    <p>Qualification:MBBS MD(Endocrinology)</p>
                    
                    <p>Experience:11</p>
                </div>
                <div className="card-section">
                    <p>Dr Ishita Mukherjee</p>
                    <img src="/images/doctorpic34.jpg"
                    alt="doctor6 picture"
                    />
                    <p>Specialization:Gynecology</p>
                    
                    <p>Qualification:MBBS MS(Obstetrics & Gynecology)</p>
                    
                    <p>Experience:16</p>
                </div>
                </div>
            </div>
        </div>
    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
}