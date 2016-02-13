# chrome-filesystem
A Chrome App's (web | sync | local) filesystem element.

Use the chrome.fileSystem API to create, read, navigate, and write to the user's local file system. With this API, Chrome Apps can read and write to a user-selected location.

## Permissions
You don't need to declare permissions to access web file system. You may declare `unlimitedStorage` permission.
You need to declare "syncFileSystem" permissions into your manifest file to access syncable file system.
You need to declare "fileSystem" permission to have access to user system's file system.

To access syncable file system declare following permission:

    "syncFileSystem"

API Docs: https://developer.chrome.com/apps/syncFileSystem

To access user filesystem:

    "fileSystem": ["write"]

API Docs: https://developer.chrome.com/apps/fileSystem

## Example of local filesystem

        <chrome-app-filesystem
          content="{{fileData}}"
          readAs="json"
          file-name="my-file.json"
          on-file-read="fileReadHandler"
          on-file-write="fileSaveHandler"
          on-error="fileErrorHandler"></chrome-app-filesystem>

## Example of web (local) filesystem

        <chrome-local-filesystem
          auto
          quota="52428800"
          content="{{fileData}}"
          mime="application/json"
          filename="my-file.json"
          on-file-read="fileReadHandler"
          on-file-write="fileSaveHandler"
          on-error="fileErrorHandler"></chrome-local-filesystem>

## Example of syncable filesystem

        <chrome-sync-filesystem
          quota="52428800"
          content="{{fileData}}"
          mime="application/json"
          filename="my-file.json"
          on-file-read="fileReadHandler"
          on-file-write="fileSaveHandler"
          on-error="fileErrorHandler"></chrome-sync-filesystem>

## Common API

### Events
| Event | Description | Parameters |
| --- | --- | --- |
| `file-read` | Fired when the file has been read. | - content {String} - Content of the file |
| `file-write` | Fired when `content` has been written to the file. | _none_ |
| `error` | Fired when an error occured. The detail object will contain original error object in `error` property. | - error {Object} - Original error object |

### Properties
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| filename | Name of the file. In local file system API, when prompting for a file to save it will be used as a suggested name. It will be set to opened file name when the file is opened. | String | _null_ |
| content | Content of the file. If auto attribute is true it will write content to file each time it change (not applicable for local file system). It will be set to file content when called `read()` function. You can set this property with any value that should be written to the file using `save()` function. The type of the `content` attribute is depended of the `readAs` attribute or string if the element wasn't able to parse the content according to set type. | String or ArrayBuffer or Blob | _null_ |
| auto | If `true` the file will be read from the filesystem as soon as `filename` attribute change. Also it will write to the filesystem as soon as `content` attribute change. | Boolean | `false` |
| mime | File content mime-type | String | `text/plain` |
| readAs | Set a type of the content to perform auto parsing. By default text will be used. If there is error while parsing the data it will set file content as string.  Currently only `text` and `json` values are supported. | String | `text` |

### Methods
#### `getFile()`
Get a file from the filesystem.

**returns** _{Promise}_ Fulfilled promise will result with _{FileEntry}_ object.

#### `read()`
Read file content.
* Result will be filled to `content` attribute.
* This function will trigger `file-read` event with file contents.

**returns** _nothing_

#### `write()`
Write `content` to the file.
* A `file-write` event will be fired when ready.

**returns** _nothing_

## Local filesystem API

### Properties
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| accepts | The optional list of accept options for file opener. Each option will be presented as a unique group to the end-user. Each group definition can be defines as an object with following properties: **description** _{String}_ - This is the optional text description for this option. **mimeTypes** _{Array&lt;String&gt;}_ - Mime-types to accept, e.g. `image/jpeg` or `audio/*`. One of mimeTypes or extensions must contain at least one valid element. **extensions** _{Array&lt;String&gt;}_ Extensions to accept, e.g. `jpg`, `gif`, `crx`. | Array&lt;String&gt; | _undefined_ |
| acceptsMultiple | Whether to accept multiple files. This is only supported for openFile and openWritableFile. | Boolean | _undefined_ |

## Web and Sync API
### Events
| Event | Description | Parameters |
| --- | --- | --- |
| `filesystem-ready` | Fired when a filesystem is ready. | _none_ |
| `filesystem-usage` | Fired when usage details are ready. | - **usageBytes** _{Number}_ - A number of currently used bytes. - **quotaBytes** _{Number}_ - A number of bytes granted by the filesystem. |
| `directory-read` | Fired when directory has been read and entries are available. | - **files** _{Array&lt;FileEntry&gt;}_ - A list of files in a directory. |
| `removed` | Fired when file has been removed. | _none_ |


### Properties
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| quota | Granted by the user agent number of bytes available to the app. It will be filled up when the app already requested filesystem. | Number | 0 |
| grantedQuota | If using web filesystem storage quota must be provided. User Agent need to know how many quota the app require. UA may not grant requested amount of disk space if e.g. `quota` is bigger than available space. Number of bytes available for the app can be read from `grantedQuota` attribute. Note that the app must set `quota` number > 0 for local FS or it will cause an error during file save. | Number | 0 |
| fileSystem | A handler to the filesystem. Call `element`.requestFilesystem() to request filesystem and set up the handler. | FileSystem | _undefined_ |

### Methods
#### `requestFilesystem()`
Request a filesystem.
* A `filesystem-ready` event will be fired when ready.
* A `fileSystem` property will be set to the file system when ready

**returns** _nothing_

#### `getUsageAndQuota()`
Requests an information about current usage and quota in bytes for the file system.
A `filesystem-usage` event will be fired when ready.

**returns** _nothing_

#### `list()`
List files from root filesystem.
* A `directory-read` event will be fired when the directory has been read.

**returns** _nothing_

#### `remove()`
Remove the file identified by the `filename` attribute.
* A `removed` event will be fired when the file has been deleted.

**returns** _nothing_
