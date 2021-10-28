#!/usr/bin/env python3
from aws_cdk import aws_dynamodb as dynamodb
from aws_cdk import core as cdk


class DynamoApp(cdk.Stack):
    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)
        self.dynamodb_table = self._create_ddb_table()

    def _create_ddb_table(self):
        dynamodb_table = dynamodb.Table(
            self,
            "AppTable",
            partition_key=dynamodb.Attribute(
                name="song_link", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="played_datetime", type=dynamodb.AttributeType.STRING
            ),
            removal_policy=cdk.RemovalPolicy.DESTROY,
        )

        cdk.CfnOutput(self, "DoYouTable", value=dynamodb_table.table_name)
        return dynamodb_table


app = cdk.App()
DynamoApp(app, "DoYouDatabase")

app.synth()
