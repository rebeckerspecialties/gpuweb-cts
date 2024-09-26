# React Native WebGPU Conformance Test Suite

This is the conformance test suite for React Native WebGPU.
It tests the behaviors defined by the [WebGPU specification](https://gpuweb.github.io/gpuweb/). This repository is forked from the [WebGPU CTS](https://github.com/gpuweb/cts) and currently targets the `react-native-wgpu` library. In the future, we hope to support any WebGPU-compliant React Native module.

The contents of this test suite are considered **normative**; implementations must pass
them to be WebGPU-conformant. Mismatches between the specification and tests are bugs.

## Building and running the Test Suite

To install dependencies for the conformance test suite, run the following command:

```
npm install
```

The React Native portion of this test suite is built on top of [React Native Test App](https://github.com/microsoft/react-native-test-app). Build instructions for your target platform can be found here: https://github.com/microsoft/react-native-test-app/wiki/Quick-Start#platform-specific-instructions. The conformance test suite targets Hermes by default.

To run tests, click the "Run Tests" button on the app homepage. Once tests complete, the app will generate a summary of failed and skipped tests, along with a list of all tests that failed. The tests will take a few minutes to run. A log of the current running test can be viewed in the Metro console.

## `react-native-wgpu` inventory

For the `react-native-wgpu` library, there are a few blockers for generating a full inventory of tests passing. Here are the test suites that currently crash or hang:

- `webgpu/api/operation/adapter`: Main thread hangs on a promise await. See: https://github.com/wcandillon/react-native-webgpu/issues/126
- `webgpu/api/operation/buffers`: `map.spec` and `map_oom.spec` have tests that crash when trying to allocate a buffer. `remapped_for_write`, `mappedAtCreation,mapState`, `mapAsync,mapState`, `mappedAtCreation`.
- `webgpu/api/operation/command_buffer`: Tests with compressed texture formats seem to hang indefinitely (e.g. astc-4x4-unorm). Tests following the copyTextureToTexture tests all seem to time out, possibly due to the depth32float_stencil8 format.
- `webgpu/api/operation/memory_sync`: The "either" interpolation option is not supported, causing shader compilation to crash. Shader compilation crashes should likely not crash the app.
- `webgpu/api/operation/render_pipeline`: Tests crash with an unknown error in `pipeline_output_targets.spec`.
- `webgpu/api/operation/rendering`: Same as `memory_sync` tests.
- `webgpu/api/operation/shader_module`: Different shader compilation issue.
- `webgpu/api/operation/storage_texture`: Same as `memory_sync` tests.
- `webgpu/api/operation/vertex_state`: Same as `memory_sync` tests.
- `webgpu/api/operation/reflection`: Attribute tests crash.

## Contributing

Please read the [introductory guidelines](docs/intro/README.md) before contributing.
Other documentation may be found in [`docs/`](docs/) and in the [helper index](https://gpuweb.github.io/cts/docs/tsdoc/) ([source](docs/helper_index.txt)).

Read [CONTRIBUTING.md](CONTRIBUTING.md) on licensing.

For realtime communication about WebGPU spec and test, join the
[#WebGPU:matrix.org room](https://app.element.io/#/room/#WebGPU:matrix.org)
on Matrix.
