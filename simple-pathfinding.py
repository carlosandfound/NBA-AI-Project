from bs4 import BeautifulSoup
from collections import defaultdict
import time
import sys

path = []
html_doc = None
player_names = ''
players = []

def pop(q):
    val = None
    val = q[0]
    if len(q) == 1:
        q = []
    else:
        q = q[1:]
    return val, q

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


def buildGraph(graph):
    for player in players:
        for i in range(len(players)):
            other_player = players[i]
            if player == other_player:
                continue
            if player[-1] == other_player[0]:
                player_name = getName(player)
                other_player_name = getName(other_player)
                graph[player_name].append(other_player_name)

'''
for name in player_names:
    if "," in name.string:
        name = name.string.lower().split(", ")[::-1]
    else:
        name = name.string.lower().split(" ")
    players.append(name)

for player in players:
    for i in range(len(players)):
        other_player = players[i]
        if player == other_player:
            continue
        if player[-1] == other_player[0]:
            g[getName(player)].append(getName(other_player))
'''

def BFS(graph, start, end):
     temp_path = [start]
     q = []
     q.append(temp_path)
     while q:
         tmp_path, q = pop(q)
         last_node = tmp_path[-1]
         print("BFS Element", last_node)
         if last_node == end:
             print("Path", tmp_path)
             break
         for link_node in graph[last_node]:
             if link_node not in tmp_path:
                 new_path = tmp_path + [link_node]
                 q.append(new_path)

def DFSUtil(graph, src, dst, visited, path):
    global DFS_paths
    visited[src] = True
    path.append(src)
    if src == dst:
        start_time = time.time()
        print("start time", start_time)
        print("DFS Path", path)
    else:
        for i in graph[src]:
            if visited[i] == False:
                print("DFS Element", i)
                DFSUtil(graph, i, dst, visited, path)
    path.pop()
    visited[src]= False

def DFS(graph, src, dst):
    visited = {}
    for player in players:
        visited[getName(player)] = False
    path = []
    DFSUtil(graph, src, dst, visited, path)

def IDSUtil(graph, src, target, maxDepth, path):
    if src == target :
        print("IDS Path", path)
        return True
    if maxDepth <= 0 :
        return False
    for i in graph[src]:
        print("IDS Element", i)
        if IDSUtil(graph, i, target, maxDepth-1, path + [i]):
            return True
    return False

def IDS(graph, src, target, maxDepth):
    path = [src]
    for i in range(maxDepth):
        if IDSUtil(graph, src, target, i, path):
            print("TRUE")
            return True
    print("FALSE")
    return False

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

    print("Running BFS, Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    BFS(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running BFS, Non-Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    BFS(g, first_player, 'lebron james')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running BFS, Goal DNE..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    BFS(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("")
    print("")
    print("")
    print("")

    print("Running DFS, Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    print("start time", start_time)
    DFS(g, first_player, last_player)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running DFS, Non-Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    DFS(g, first_player, 'lebron james')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running DFS, Goal DNE..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    DFS(g, first_player, 'carlos alvarenga')
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("")
    print("")
    print("")
    print("")

    print("Running IDS, Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    IDS(g, first_player, last_player, maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDS, Non-Valid Goal..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    IDS(g, first_player, 'lebron james', maxDepth)
    print("--- %s seconds ---" % (time.time() - start_time))
    print(" ")

    print("Running IDS, Goal DNE..........")
    g = defaultdict(list)
    buildGraph(g)
    start_time = time.time()
    IDS(g, first_player, 'carlos alvarenga', maxDepth)
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
