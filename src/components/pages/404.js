import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";

const Page404 = () => {
    
    const navigate = useNavigate();
    console.log(navigate);

    const style = {
        'text-align': 'center',
        'color':'red',
        'font-size': 25,
        'line-height': 30
    }

    return(
        <div>
            <ErrorMessage />
            <p style={style}>404 error: Page not found</p>
            <Link style={{'display': 'block', 'margin': '0 auto'}} to='/'><p style={style}>Back to main page</p></Link>
            <br />
            <p
                style={{'cursor': 'pointer', ...style}}
                onClick={() => navigate(-1)}
            > 
            To previous page</p>
            
        </div>
    )   
}

export default Page404;