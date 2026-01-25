import requests
import random


def crawl (prompt):
  API_URL = "https://api.search1api.com/search"
# "query": "AI news",  # Required
  data = {

      "query":prompt,
      "search_service": "google",  
      "max_results": 8,  
      "crawl_results": 1,  
      "image": False,  
      # "include_sites": ["techcrunch.com"],  
      "exclude_sites": ["wikipedia.org"],  
      "language": "en",  
      # "time_range": "month"  
  }

  proxy_list = [
    "http://45.80.110.26:80",
    "http://188.42.89.182:80",
  ]
  headers = {
      # "Authorization": "Bearer your_search1api_key", # Optional for Keyless Free Tier
      "Content-Type": "application/json",
      "x-forwarded-for":"abc"
  }
  selected_proxy = random.choice(proxy_list)
  proxies = {"http": selected_proxy, "https": selected_proxy}
  session = requests.Session()
  session.proxies = {"http": None, "https": None}
  response = session.post(API_URL, headers=headers, json=data)
  # response = requests.post(
  #     API_URL,
  #     headers=headers,
  #     json=data,
  #     proxies=proxies, timeout=10
  # )

  results = response.json()
  print("results",results)

crawl("What is Indigo stock price closed on 19 jan 2026. Tell just the price.")
