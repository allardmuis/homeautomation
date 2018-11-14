terraform {
  backend "s3" {
    bucket  = "homeautomation-state"
    key     = "homeautomation.tfstate"
    region  = "eu-west-1"
    encrypt = true
    profile = "personal"
  }

  required_version = "~> 0.11"
}

provider "aws" {
  region  = "eu-west-1"
  version = "1.39"
  profile = "personal"
}