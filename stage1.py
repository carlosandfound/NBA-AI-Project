from bs4 import BeautifulSoup
from collections import defaultdict
from copy import deepcopy
import time
import sys

html_doc = None
player_names = ''
players = []
paths = []

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

def BFS(graph, start, end):
     temp_path = [start]
     q = []
     q.append(temp_path)
     while q:
         tmp_path, q = pop(q)
         last_node = tmp_path[-1]
         if last_node == end:
             paths.append(tmp_path)
         for link_node in graph[last_node]:
             if link_node not in tmp_path:
                 new_path = tmp_path + [link_node]
                 q.append(new_path)

def DFSUtil(graph, src, dst, visited, path):
    visited[src] = True
    path.append(src)
    if src == dst:
        paths.append(path)
    else:
        for i in graph[src]:
            if visited[i] == False:
                DFSUtil(graph, i, dst, visited, path)
    path.pop()
    visited[src]= False


def DFS(graph, src, dst):
    visited = {}
    for player in players:
        visited[getName(player)] = False
    path = []
    DFSUtil(graph, src, dst, visited, path)

def initialize():
    global player_names
    global players
    soup = BeautifulSoup(html_doc, 'html.parser')
    player_names = soup.find_all(class_ =  "players-list__name")
    extractPlayers()

def run():
    global paths

    print("Running BFS..........")
    g = defaultdict(list)
    buildGraph(g)
    bfs_graph = deepcopy(g)

    start_time = time.time()
    for i in bfs_graph:
        for j in players:
            j = getName(j)
            if (i != j):
                BFS(g, i, j)
    print("--- %s seconds ---" % (time.time() - start_time))

    max_so_far = []
    for chain in paths:
        if len(chain) > len(max_so_far):
            max_so_far = chain
    print("MAX CHAIN", max_so_far)

    print("\n\n")

    print("Running DFS..........")
    g = defaultdict(list)
    buildGraph(g)
    dfs_graph = deepcopy(g)
    paths = []
    start_time = time.time()
    for i in dfs_graph:
        for j in players:
            j = getName(j)
            if (i != j):
                DFS(g, i, j)
    print("--- %s seconds ---" % (time.time() - start_time))

    max_so_far = []
    for chain in paths:
        if len(chain) > len(max_so_far):
            max_so_far = chain

if __name__ == '__main__':
    filename = sys.argv[1]
    with open (filename, "r") as myfile:
        html_doc=myfile.read()
    initialize()
    run()
