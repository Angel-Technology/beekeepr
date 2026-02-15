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

### ios doctor

```sh
[bundle exec] fastlane ios doctor
```

Check fastlane setup

### ios validate_asc

```sh
[bundle exec] fastlane ios validate_asc
```

Validate App Store Connect API key

### ios build

```sh
[bundle exec] fastlane ios build
```

Build iOS IPA

### ios upload_testflight

```sh
[bundle exec] fastlane ios upload_testflight
```

Upload IPA to TestFlight

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

Upload AAB to Google Play

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
