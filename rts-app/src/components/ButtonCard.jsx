import React from "react";
import { Card, Row } from "antd";

const ButtonCard = ({ title, onClick, icon }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: "69px",
            height: "69px",
            borderRadius: "50%",
            backgroundColor: "#1890ff", // Ant Design primary color
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)", // Soft shadow
          }}
        >
          {React.cloneElement(icon, { style: { fontSize: "24px", color: "#fff" } })}
        </div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#333", marginBottom: "10px" }}>
          {title}
        </h3>
        <Row gutter={10}></Row>
      </div>
    </Card>
  );
};

export default ButtonCard;
