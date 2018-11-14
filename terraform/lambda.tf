resource "aws_iam_role" "home_automation_lambda" {
  name = "home_automation_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "home_automation_acccess_dynamodb" {
  name = "home_automation_acccess_dynamodb"
  role = "${aws_iam_role.home_automation_lambda.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "dynamodb:*",
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_lambda_function" "home_automation_lambda" {
  filename         = "../package.zip"
  function_name    = "home_automation"
  role             = "${aws_iam_role.home_automation_lambda.arn}"
  handler          = "server.handler"
  source_code_hash = "${base64sha256(file("../package.zip"))}"
  runtime          = "nodejs8.10"
  timeout          = 10
}