import { NavLink } from "react-router-dom";
export const Error=() =>{
    return (
        <>
        <section id="error-page">
            <div className="content">
                <h2 className="header">404</h2>
                <br/>
                <h3>Sorry! Page Not Found</h3>
                <br/>
                <p>
                    Oops! We could not find the page you are trying to reach. 
                    It may have been deleted or the link might be incorrect.
                    Please double-check the address or return to the homepage to continue browsing.
                </p>
                <div className="btns">
                  <NavLink to="/">Return Home</NavLink>
                  <NavLink to="/">Report Problem</NavLink>
                </div>
            </div>
        </section>
        (
        <>
    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
        </>
    );
};