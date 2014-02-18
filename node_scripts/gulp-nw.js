module.exports={
    'win32':{
      url:'https://s3.amazonaws.com/node-webkit/v0.8.2/node-webkit-v0.8.2-win-ia32.zip',
      zip:'node_webkit/download/win-ia32.zip',
      path:'node_webkit/win-ia32',
      bin:'..\\node_webkit\\win-ia32\\nw.exe'
    },
    'darwin':{
      url:'https://s3.amazonaws.com/node-webkit/v0.8.2/node-webkit-v0.8.2-osx-ia32.zip',
      zip:'node_webkit/download/osx-ia32.zip',
      path:'node_webkit/osx-ia32',
      bin:'../node_webkit/osx-ia32/node-webkit.app/Contents/MacOS/node-webkit'
    },
    'linux':{
      node_webkit_url:'https://s3.amazonaws.com/node-webkit/v0.8.2/node-webkit-v0.8.2-linux-ia32.zip',
      zip:'node_webkit/download/linux-ia32.zip',
      path:'node_webkit/linux-ia32'
    }
  }
  [process.platform];