#!/bin/bash
echo "Starting Medusa MVP..."
echo "Backend: http://127.0.0.1:9000"
echo "Storefront: http://127.0.0.1:8000"

(cd medusa-mvp && npm run dev) & 
(cd medusa-storefront && npm run dev) &

wait
