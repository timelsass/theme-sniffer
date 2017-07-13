=== Theme Sniffer ===
Contributors: rabmalin, grapplerulrich
Tags: check, checker, template, theme, tool
Requires at least: 4.0
Tested up to: 4.8
Stable tag: 0.1.4
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

* `Hide Warning` - Enable this to hide warnings
* Raw Output` - Enable this to display sniff report in plaintext format. Suitable to copy/paste report to trac ticket

== Changelog ==

= 1.0 =
* Initial release