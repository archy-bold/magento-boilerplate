<h1>Magento Boilerplate</h1>

Author: Simon Archer / Jason Alvis (forked)<br />
Author Email: hello@archybold.com / hello@jasonalvis.co.uk<br />
Version: 0.0.1<br />
License: Free General Public License (GPL)<br />

<h2>Brief</h2>
Starting a Magento project the right way is a must for any developer. This project has many benefits and is the base framework for any new project I start. It adheres to the recommended Magento templating hierarchy and has been built from the ground up.<br /><br />
Note: This boilerplate is **NOT** complete, it is an ongoing project and it will take time to finish. The CSS has been written from scratch and I am slowly styling section by section as I go along, sit tight. If your expecting a fully fledged finished framework this is not for you.<br /><br />
A demo site will be added in due course.

<h2>Goods</h2>

<h3>Sass</h3>
The CSS has been written completely from scratch and is component based meaning each area is isolated making it highly re-useable. It is based of the <a href="http://html5boilerplate.com/" target="_blank">HTML5 boilerplate</a> and also includes the latest version of <a href="https://necolas.github.io/normalize.css/" target="_blank">Normalize</a>.

<h3>Removes default xml blocks</h3>
Magento by default bundles a handful of xml blocks that are rarely used and only causes bloat, so I removed them from within local.xml.<br /><br />
Note: They can be added back in if you need them by simply removing the line of code from local.xml.

<h3>Removes unnecessary JS files that are rarely used</h3>
Magento by default bundles a handful of JS files that are rarely used and only causes bloat/performance issues, so I removed them from within local.xml.<br /><br />
Note: They can be added back in if you need them by simply removing the line of code from local.xml.

<h3>Includes jQuery in no conflict mode</h3>
jQuery v1.10.2 minified in no conflict mode is included as default, you can change this to include a more up to date version if you wish. It gets included at the very bottom of the dom just like it should be.<br /><br />
This improves performance issues particularly on mobile devices as when a browser hits a script tag it actually waits for that entire asset to download before it proceeds, if it's in the head your going to block everything that renders visually on your page from starting.

<h3>Gulp</h3>
Gulp is all setup and ready to go. It comes with tasks to build the CSS from SCSS and concatenates and uglifies the javascript.

<h2>Installation</h2>
Drop in the directories app and skin within your Magento hierarchy e.g:<br /><br />
magento > public_html > app<br />
magento > public_html > skin<br /><br />
Then you will need to change the package name in the admin panel to render the new package you have just installed (system > configuration > design > package).

<h2>Using Gulp</h2>
First off I'm going to assume you have successfully installed Node.js and Gulp, if you haven't you need to do this first.
First install <a href="http://nodejs.org/download/" target="_blank">Node.js</a> then install <a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md" target="_blank">Gulp</a>. Once you've done that proceed below.

cd into the skin theme directory like so

```shell
cd {site_path}/skin/frontend/magentoboilerplate/default
```

Install the project dependencies

```shell
npm install
```

Make changes to your files (sass and js) then you'll want to run gulp to initiate the tasks

```shell
gulp
```

Take it a step further and install the browser add-on <a href="http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-" target="_blank">LiveReload</a>. With LiveReload you won’t have to go back to your browser and refresh the page. Page refreshes happen automatically and in the case of CSS, new styles are injected without a page refresh.