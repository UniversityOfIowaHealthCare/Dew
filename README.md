# Dew
A command line utility for creating custom Drupal modules. Works for Drupal 7 & 8.

# NOTE: This utility is not yet completed. Below is an outline of how it will function once it is.

## Installation
Dew is installed through npm. To get it, be sure you have npm installed, then run this command in your terminal:
```
$ npm i -g @uihc/dew
```

## Usage
Simply run `dew` followed by your human readable module name.
```bash
$ dew "Human readable name" -n optional_machine_name 
``` 
If you omit the machine name option (`-n` or `--machine-name`), dew will automatically generate it for you by taking the human readable name you provide and converting it to lower snake case. 
#### Options
`--machine-name, n`:
  Allows you to specify the machine name rather than having dew generate it. As per Drupal standards, this name must be represented in snake case with all lower case letters.
