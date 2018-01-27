=== Theme Sniffer ===
Contributors: rabmalin, grapplerulrich, dingo_bastard
Tags: check, checker, template, theme, tool
Requires at least: 4.0
Tested up to: 4.9.2
Requires PHP: 5.3
Stable tag: 0.1.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Theme Sniffer will help you analyze your theme code, to ensure compatibility with the latest WordPress coding standards.

== Description ==

Theme Sniffer is a plugin utilizing custom sniffs for [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer) that statically analyzes your theme and ensures that it adheres to WordPress coding conventions.

== Installation ==

= Installing from WordPress repository: =

1. From the dashboard of your site, navigate to Plugins –> Add New.
2. In the Search type Theme Sniffer
3. Click Install Now
4. When it’s finished, activate the plugin via the prompt. A message will show confirming activation was successful.

Make sure that your server has php version greater or equal to 5.3, otherwise the plugin won't activate.

= Uploading the .zip file: =

1. From the dashboard of your site, navigate to Plugins –> Add New.
2. Select the Upload option and hit "Choose File."
3. When the pop-up appears select the theme-sniffer.x.x.zip file from your desktop. (The ‘x.x’ will change depending on the current version number).
4. Follow the on-screen instructions and wait as the upload completes.
When it’s finished, activate the plugin via the prompt. A message will show confirming activation was successful.

== Frequently Asked Questions ==

= How to use the plugin? =

* Go to `Appearance` -> `Theme Sniffer`
* Select theme from the dropdown
* Click `GO`

= What options are there? =

* `Select Standard` - Select the standard with which you would like to sniff the theme
* `Hide Warning` - Enable this to hide warnings
* `Raw Output` - Enable this to display sniff report in plaintext format. Suitable to copy/paste report to trac ticket
* `PHP version` - Select the minimum PHP Version to check if your theme will work with that version

== Upgrade Notice ==

The latest upgrade mostly with development changes and some minor improvements in sniff handling.

== Changelog ==

= 0.1.5 =
* Change the development process
* Modern JS development workflow

= 0.1.4 =
* Using REST instead of admin-ajax for checks
* Code optimisation

= 0.1.3 =
* Update zip link in the readme file

= 0.1.2 =
* Add option to display report in HTML or raw format
* Update to latest sniffs

= 0.1.1 =
* Fix sniffer issues in admin files

= 0.1.0 =
* Initial pre-release
