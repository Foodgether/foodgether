echo "Building Front End"

cd frontend
yarn install --legacy-peer-deps

OUT_DIR="./src/pb"
rm -r $OUT_DIR
mkdir $OUT_DIR

npx protoc \
  --ts_out src/pb/ \
  --ts_opt long_type_string \
  --proto_path ../proto \
  ../proto/orders.proto 


export VITE_BASE_PATH=/foodgether && yarn build

