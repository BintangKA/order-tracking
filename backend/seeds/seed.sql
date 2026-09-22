USE order_tracking;

INSERT INTO
    orders (
        order_number,
        customer_name,
        service,
        status,
        version
    )
VALUES (
        'ORD-001',
        'Bintang',
        'AC Installation',
        'PENDING',
        1
    ),
    (
        'ORD-002',
        'Andi',
        'Machine Maintenance',
        'ASSIGNED',
        1
    ),
    (
        'ORD-003',
        'Sinta',
        'Electrical Repair',
        'IN_PROGRESS',
        1
    );