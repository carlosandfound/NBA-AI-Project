from bs4 import BeautifulSoup
import time
import sys

path = []
html_doc = None
player_names = ''
players = []

class Graph:
    def __init__(self):
        self.edges = {}
        self.weights = {}

    def neighbors(self, id):
        return self.edges.get(id, [])

    def cost(self, a, b):
        return self.weights.get((a, b), 1)

    def add(self, a, b, w):
        self.edges.setdefault(a, []).append(b)
        self.weights[(a, b)] = w

    def __len__(self):
        return len(self.edges)


class PriorityQueue:
    def __init__(self):
        self.elements = {}

    def empty(self):
        return len(self.elements) == 0

    def put(self, item, priority):
        if item in self.elements:
            print("Reprioritizing", item, "from", self.elements[item], "to", priority)
        self.elements[item] = priority

    def get(self):
        best_item, best_priority = None, None
        for item, priority in self.elements.items():
            if best_priority is None or priority < best_priority:
                best_item, best_priority = item, priority

        del self.elements[best_item]
        return best_item

def heuristic(goal, next):
    distance = 10
    if next in path:
        index = path.index(next) + 1
        distance = len(path) - index
    return distance

def dijkstra(graph, start, target):
    frontier = PriorityQueue()
    frontier.put(start, 0)
    ans = []
    came_from = {}
    cost_so_far = {}
    came_from[start] = None
    cost_so_far[start] = 0

    while not frontier.empty():
        current = frontier.get()
        print("Dijkstra Element", current)
        ans += [current]
        if current == target:
            print(ans)
            break
        for next in graph.neighbors(current):
            new_cost = cost_so_far[current] + graph.cost(current, next)
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost
                frontier.put(next, new_cost)
                came_from[next] = current

def a_star_search(graph, start, goal):
    frontier = PriorityQueue()
    frontier.put(start, 0)
    came_from = {}
    cost_so_far = {}
    came_from[start] = None
    cost_so_far[start] = 0

    while not frontier.empty():
        current = frontier.get()
        print("A* Element", current)

        if current == goal:
            print("GOAL")
            break

        for next in graph.neighbors(current):
            new_cost = cost_so_far[current] + graph.cost(current, next)
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost
                priority = new_cost + heuristic(goal, next)
                frontier.put(next, priority)
                came_from[next] = current
    return came_from, cost_so_far

def IDAUtil(graph, start, goal, maxDepth):
    frontier = PriorityQueue()
    frontier.put(start, 0)
    came_from = {}
    cost_so_far = {}
    came_from[start] = None
    cost_so_far[start] = 0

    while not frontier.empty():
        current = frontier.get()
        print("IDA* Element", current)
        if current == goal:
            print("GOAL")
            return True
        if maxDepth <= 0 :
            return False
        for next in graph.neighbors(current):
            new_cost = cost_so_far[current] + graph.cost(current, next)
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost
                priority = new_cost + heuristic(goal, next)
                frontier.put(next, priority)
                came_from[next] = current
        maxDepth = maxDepth - 1

def IDA(graph, src, target, maxDepth):
    path = [src]
    for i in range(maxDepth):
        if IDAUtil(graph, src, target, i):
            print("TRUE")
            return True
    print("FALSE")
    return False

def getName(name_list):
    name = ''
    length = len(name_list)
    for i in range(length):
        name += name_list[i]
        if i < length - 1:
            name += ' '
    return name

def extractPlayers():
    for name in player_names:
        if "," in name.string:
            name = name.string.lower().split(", ")[::-1]
        else:
            name = name.string.lower().split(" ")
        players.append(name)


def addNeighbor(graph, player, other_player, close_count, far_count):
    if player in path:
        if other_player in path:
            graph.add(player, other_player, close_count)
            close_count += 1
        else:
            graph.add(player, other_player, far_count)
            far_count += 2
    else:
        graph.add(player, other_player, far_count)
        far_count += 2
    return close_count, far_count

def buildWeightedGraph(graph):
    close_count = 1
    far_count = 2
    for player in players:
        for i in range(len(players)):
            other_player = players[i]
            if player == other_player:
                continue
            if player[-1] == other_player[0]:
                player_name = getName(player)
                other_player_name = getName(other_player)
                close_count, far_count = addNeighbor(graph, player_name, other_player_name, close_count, far_count)

def buildUnweightedGraph(graph):
    for player in players:
        for i in range(len(players)):
            other_player = players[i]
            if player == other_player:
                continue
            if player[-1] == other_player[0]:
                player_name = getName(player)
                other_player_name = getName(other_player)
                graph.add(player_name, other_player_name, 1)

def initialize():
    global player_names
    global players
    soup = BeautifulSoup(html_doc, 'html.parser')
    player_names = soup.find_all(class_ =  "players-list__name")
    extractPlayers()

def run():
    first_player = path[0]
    last_player = path[-1]
    maxDepth = len(path)

    print("Running Dijkstra's, Weighted, Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running Dijkstra's, Unweighted, Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running Dijkstra's, Weighted, Non-Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, 'kobe bryant')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running Dijkstra's, Unweighted, Non-Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, 'kobe bryant')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running Dijkstra's, Weighted, Goal DNE..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running Dijkstra's, Unweighted, Goal DNE..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    dijkstra(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("")
    print("")
    print("")
    print("")

    print("Running A*, Weighted, Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running A*, Unweighted, Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running A*, Weighted, Non-Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, 'kobe bryant')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running A*, Unweighted, Non-Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, 'kobe bryant')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running A*, Weighted, Goal DNE..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running A*, Unweighted, Goal DNE..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    a_star_search(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("")
    print("")
    print("")
    print("")

    print("Running IDA*, Weighted, Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, last_player, maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDA*, Unweighted, Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, last_player, maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDA*, Weighted, Non-Valid Goal..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, 'lebron james', maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDA*, Unweighted, Non-Valid Goal..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, 'lebron james', maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDA*, Weighted, Goal DNE..........")
    g = Graph()
    buildWeightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, last_player, maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDA*, Unweighted, Goal DNE..........")
    g = Graph()
    buildUnweightedGraph(g)
    start_time = time.time()
    IDA(g, first_player, 'carlos alvarenga', maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

if __name__ == '__main__':
    filename = sys.argv[1]
    with open (filename, "r") as myfile:
        html_doc=myfile.read()
    if filename == 'small-sample.html':
        path = ['chris paul', 'paul george', 'george hill']
        #path = ['d.j. wilson', 'wilson chandler', 'chandler hutchison']
    else:
        path = ['ronnie lester', 'lester conner', 'conner henry', 'henry james',
        'james thomas', 'thomas jordan', 'jordan mickey', 'mickey dillard', 'dillard crocker']
    initialize()
    run()
