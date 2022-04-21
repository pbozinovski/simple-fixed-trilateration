# Simple fixed distance trilateration

This project demonstrates trilateration, trilateration is determining a position by knowing your distance from at least 3 known points.

### Types of nodes
- Blue node (anchor node)
- Red node (normal node)
- Yellow node (found node)

![Picture1](https://user-images.githubusercontent.com/26391084/164468581-bcc2056a-d8c4-4c2f-8d25-4559986f2a38.png)

### Usage
You start by clicking the button Find all, by clicking on that button you locate all nodes that are in range of at least 3 anchor nodes

![Picture2](https://user-images.githubusercontent.com/26391084/164469062-2ccca2a3-9b4b-4371-91ec-0fdd0cefe3e6.png)

After finding all nodes that are in range, by clicking on the button Draw again you transform all found nodes into anchor nodes which are used for locating
other normal nodes.

![Picture3](https://user-images.githubusercontent.com/26391084/164469696-3e3f6cae-36bf-45c4-9e9a-780aca51d549.png)

You repeat this process until you find all of the nodes

![Picture6](https://user-images.githubusercontent.com/26391084/164469808-f1c88103-4741-48f8-9d98-27b0d59ced71.png)

Implemented in Javascript Canvas
