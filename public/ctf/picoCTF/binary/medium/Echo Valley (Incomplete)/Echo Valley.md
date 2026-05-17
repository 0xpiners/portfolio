
-----------

#### Description

The echo valley is a simple function that echoes back whatever you say to it. But how do you make it respond with something more interesting, like a flag? Download the source: [valley.c](https://challenge-files.picoctf.net/c_shape_facility/3540df5468ae2357d00a7a3e2d396e6522b24f7a363cbaff8badcb270d186bda/valley.c) Download the binary: [valley](https://challenge-files.picoctf.net/c_shape_facility/3540df5468ae2357d00a7a3e2d396e6522b24f7a363cbaff8badcb270d186bda/valley) Connect to the service at `nc shape-facility.picoctf.net 56523`

![[Pasted image 20251115013203.png]]

![[Pasted image 20251115121448.png]]
As we can see, this script asks the user to "shout", saves the input in the buf var of 100 bytes and then printf(buf). This is the important part since theres not format specification, we can abuse this with a **format string** vulnerability.

We also have the print_flag() function which we can leak the offset using this vulnerability and then calculate the address of that func. We have to do this because this is a PIE executable so the base address is randomized every time we execute it.

