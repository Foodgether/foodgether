OUT_DIR="./src/pb"
rm -r $OUT_DIR
mkdir $OUT_DIR

npx protoc \
  --ts_out src/pb/ \
  --ts_opt long_type_string \
  --proto_path ../proto \
  ../proto/orders.proto 