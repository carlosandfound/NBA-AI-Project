# NBA Artificial Intelligence Research Project

### Purpose
Implement the following pathfinding and exploratory algorithms in python to compare their efficiency in solving the NBA "name chaining problem" (NCP):
- Breadth-First a_star_search
- Depth-First-Search
- Iterative Deepening Depth-First Search
- Dijkstra's
- A*
- Iterative Deepening A*


### Files
- project-requirements.pdf: details the requirements and guidelines of the research project
- [**pathfinding-and-exploration.pdf**](https://github.com/carlosandfound/NBA-AI-Research/blob/master/pathfinding-and-exploration.pdf): research paper detailing the problem being problem, the reasoning behind the proposed solution, and the analysis on the experiment findings
- small-sample.html: contains information extracted from NBA.com about all current NBA players
- large-sample.html: contains information extracted from NBA.com about all current and past NBA players
- stage1.py: contains implementation of exploratory algorithms used in stage one of the project to find the longest chained name (LCN)
- stage2.py: contains implementation of exploratory and unweighted pathfinding algorithms used in stage two to solve the NCP
- stage3.py: contains implementation of unweighted and weighted pathfinding algorithms used in stage three to solve the NCP


### How to run
Run command "python &lt;PROGRAM FILENAME&gt; &lt;DATA FILENAME&gt;" where
1. 'PROGRAM FILENAME' is either 'exploration.py', 'simple-pathfinding.py', or 'advanced-pathfinding.py'
2. 'DATA FILENAME' is either 'small-sample.html' or 'large-sample.html'
