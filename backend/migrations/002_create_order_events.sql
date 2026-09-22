CREATE TABLE IF NOT EXISTS order_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    event_id VARCHAR(100) NOT NULL UNIQUE,
    previous_status ENUM(
        'PENDING',
        'ASSIGNED',
        'IN_PROGRESS',
        'DONE',
        'CANCELLED'
    ) NULL,
    new_status ENUM(
        'PENDING',
        'ASSIGNED',
        'IN_PROGRESS',
        'DONE',
        'CANCELLED'
    ) NOT NULL,
    version INT UNSIGNED NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_events_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    INDEX idx_order_events_order_id (order_id),
    INDEX idx_order_events_created_at (created_at),
    INDEX idx_order_events_order_version (order_id, version)
);