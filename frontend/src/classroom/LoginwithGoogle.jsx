const GoogleAuth = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:4000/auth/google';
    };
    
    return (
        <div>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default GoogleAuth;
