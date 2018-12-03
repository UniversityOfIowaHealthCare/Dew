# Dew
A command line utility for creating custom Drupal modules. Works for Drupal 7 & 8.

## Installation
Dew is installed through npm. To get it, be sure you have npm installed, then run this command in your terminal:
```
$ npm i -g @uihc/dew
```

## Usage
Simply run `dew` followed by your human readable module name from your Drupal site's `docroot` directory.
```bash
$ dew "Human readable name" -m optional_machine_name 
``` 
If you omit the machine name option (`-m` or `--machine-name`), dew will automatically generate it for you by taking the human readable name you provide and converting it to lower snake case. 

#### Options
`--machine-name, m`:
  Allows you to specify the machine name rather than having dew generate it. As per Drupal standards, this name must be represented in snake case with all lower case letters.

`--seven, -s`:
  Create a Drupal 7 module. Without this option, Dew will default to Drupal 8.  

`--default, d`:
  [Drupal 7 only] Create the module within the `sites/default/` folder rather than the `sites/all/` folder.
  
  
### Todo
- Support stand alone modules (not in a drupal project).
- Automate template bundling.
