
run: wasm
	npm run dev

wasm:
	cd rem8x; wasm-pack build --dev

release:
	cd rem8x; wasm-pack build --release
	npm run build

test:
	npm run test
