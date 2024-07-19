import time
# thegraph queries
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from defyes.functions import get_node
from defabipedia import Chain
from lib.dump import dump
import os

base_url = "https://gateway-arbitrum.network.thegraph.com/api/{API_KEY}/subgraphs/id/".format(API_KEY=os.environ['THE_GRAPH_API_KEY'])


subgraph_urls = {
    Chain.ETHEREUM: base_url + "5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV",
    Chain.ARBITRUM: base_url + "FbCGRftH4a3yZugY7TnbYgPJVEv2LvMT6oF1fxPe9aJM",
}


#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# subgraph_query_all_pools
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def subgraph_query_all_pools(blockchain, min_tvl_usd=0, min_volume_usd=0):

    # Initialize subgraph
    subgraph_url = subgraph_urls[blockchain]
    uniswapv3_transport = RequestsHTTPTransport(
        url=subgraph_url, verify=True, retries=3
    )
    client = Client(transport=uniswapv3_transport)

    pools = {}
    response = {}
    last_timestamp = 0
    all_found = False

    web3 = get_node(blockchain)

    try:
        query_string = """
        query {{
        pools(first: 1000, orderBy: createdAtTimestamp, orderDirection: asc) 
            {{
                id
                token0{{id symbol}}
                token1{{id symbol}}
                feeTier
                volumeUSD
                totalValueLockedUSD
                createdAtTimestamp
            }}
        }}
        """

        formatted_query_string = query_string.format()
        response = client.execute(gql(formatted_query_string))
        for pool in response["pools"]:
            volume_usd = float(pool["volumeUSD"])
            tvl_usd = float(pool["totalValueLockedUSD"])

            if volume_usd >= min_volume_usd and tvl_usd >= min_tvl_usd:
                pools[pool["id"]] = [
                    web3.to_checksum_address(pool["token0"]["id"]),
                    pool["token0"]["symbol"],
                    web3.to_checksum_address(pool["token1"]["id"]),
                    pool["token1"]["symbol"],
                    int(pool["feeTier"]),
                    volume_usd,
                    tvl_usd,
                ]

        if len(response["pools"]) < 1000:
            all_found = True
            print("All pools found")
        else:
            print("Not all pools found", len(response["pools"]))
            last_timestamp = int(pool["createdAtTimestamp"]) - 1
        print(last_timestamp)

    except Exception as Ex:
        print(Ex)

    if not all_found and last_timestamp > 0:

        try:
            while not all_found:
                query_string = """
                query {{
                pools(first: 1000, orderBy: createdAtTimestamp, orderDirection: asc
                where: {{createdAtTimestamp_gt: {last_timestamp} }})
                    {{
                        id
                        token0{{id symbol}}
                        token1{{id symbol}}
                        feeTier
                        volumeUSD
                        totalValueLockedUSD
                        createdAtTimestamp
                    }}
                }}
                """

                formatted_query_string = query_string.format(
                    last_timestamp=last_timestamp
                )
                response = client.execute(gql(formatted_query_string))

                for pool in response["pools"]:
                    volume_usd = float(pool["volumeUSD"])
                    tvl_usd = float(pool["totalValueLockedUSD"])

                    if volume_usd >= min_volume_usd and tvl_usd >= min_tvl_usd:
                        pools[pool["id"]] = [
                            web3.to_checksum_address(pool["token0"]["id"]),
                            pool["token0"]["symbol"],
                            web3.to_checksum_address(pool["token1"]["id"]),
                            pool["token1"]["symbol"],
                            int(pool["feeTier"]),
                            volume_usd,
                            tvl_usd,
                        ]

                print(last_timestamp)
                if len(response["pools"]) < 1000:
                    all_found = True
                else:
                    last_timestamp = int(pool["createdAtTimestamp"]) - 1
                    time.sleep(5)


        except Exception as Ex:
            print(Ex)

    return pools

#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# protocol_data
#---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def protocol_data(blockchain, min_tvl_usd=0, min_volume_usd=0):

    tokens = []

    pools = subgraph_query_all_pools(blockchain, min_tvl_usd=min_tvl_usd, min_volume_usd=min_volume_usd)

    if len(pools) > 0:
        pools = dict(sorted(pools.items(), key=lambda item: item[1][4], reverse=True))

        for pool in pools:
            token0 = {
                "address": pools[pool][0],
                "symbol": pools[pool][1],
            }
            if token0 not in tokens:
                tokens.append(token0)
            token1 = {
                "address": pools[pool][2],
                "symbol": pools[pool][3],
            }
            if token1 not in tokens:
                tokens.append(token1)
                      
    
        dump(tokens, 'uniswap/v3', '_info_{chain}.ts'.format(chain=blockchain.lower()))

