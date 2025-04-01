import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button, Result } from "antd";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7FAFC' }}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="/">
              <Button type="primary" size="large" style={{ padding: '0.5rem 1rem' }}>
                Back to Home
              </Button>
            </Link>
          }
          style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem' }}
      />
    </div>
  );
};

export default NotFound;
