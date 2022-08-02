# Foodgether frontend

## Tech stack:

- Framework/Library: React
- Code: TypeScript
- Build tool: Vite
- Alert popup: SweetAlert2
- Styling: NextUI

## Getting started

1. Install `Node 17` or `Node 18`
2. `yarn install` to install dependencies, check `package.json`
3. `yarn dev` to start local server, check `package.json`

## Environment Variable

- `VITE_FOODGETHER_GRPC_URL`: GRPC URL for realtime order updates
- `VITE_FOODGETHER_BACKEND_URL`: API URL to interact
- `VITE_BASE_PATH`: Path where the frontend will be hosted

**Default value is set at `src\config.ts`**
**VITE prefix is required by vite itself. Without VITE prefix, vite won't add the environment variable**

## Protobuf compilation

Although using realtime order updates is optional, compilation of protobuf is required for completeness

Run this command to compile the protobuf
```javascript
npx protoc \
  --ts_out src/pb/ \
  --ts_opt long_type_string \
  --proto_path ../proto \
  ../proto/orders.proto 
```