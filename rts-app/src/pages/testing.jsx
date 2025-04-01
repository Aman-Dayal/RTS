import React, { useState } from "react";
import { Card, Col, Row } from "antd";

const initialColumns = {
  todo: [{ id: "1", title: "Task 1" }, { id: "2", title: "Task 2" }],
  inProgress: [{ id: "3", title: "Task 3" }, { id: "4", title: "Task 4" }],
  done: [{ id: "5", title: "Task 5" }]
};

const CustomDnDKanban = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, task, sourceColumn) => {
    setDraggedItem({ task, sourceColumn });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { task, sourceColumn } = draggedItem;

    // Prevent dropping into the same column
    if (sourceColumn === targetColumn) return;

    // Remove task from source column
    const newSourceTasks = columns[sourceColumn].filter((t) => t.id !== task.id);

    // Add task to the new column
    const newTargetTasks = [...columns[targetColumn], task];

    // Update the state
    setColumns({
      ...columns,
      [sourceColumn]: newSourceTasks,
      [targetColumn]: newTargetTasks,
    });

    // Reset dragged item
    setDraggedItem(null);
  };

  return (
    <Row gutter={16}>
      {Object.entries(columns).map(([columnId, tasks]) => (
        <Col key={columnId} span={8}>
          <h3>{columnId.toUpperCase()}</h3>
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId)}
            style={{ minHeight: 200, padding: 8, background: "#f4f4f4", borderRadius: 8 }}
          >
            {tasks.map((task) => (
              <Card
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task, columnId)}
                style={{ marginBottom: 8, cursor: "grab" }}
              >
                {task.title}
              </Card>
            ))}
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default CustomDnDKanban;
