fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios sync_signing

```sh
[bundle exec] fastlane ios sync_signing
```

Sync App Store signing (match)

### ios build

```sh
[bundle exec] fastlane ios build
```

Build signed IPA for TestFlight / App Store

### ios upload_testflight

```sh
[bundle exec] fastlane ios upload_testflight
```

Upload to TestFlight

### ios submit_review

```sh
[bundle exec] fastlane ios submit_review
```

Submit to App Store review

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Build Android AAB

### android play

```sh
[bundle exec] fastlane android play
```

Upload to Google Play

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
