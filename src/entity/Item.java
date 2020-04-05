
package entity;

import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Item {

	private String itemId;
	private String name;
	private double rating;
	private String address;
	private String date;
	private String localTime;
	private Set<String> categories;
	private String imageUrl;
	private String url;
	private double distance;

	public String getItemId() {
		return itemId;
	}

	public String getName() {
		return name;
	}

	public double getRating() {
		return rating;
	}

	public String getAddress() {
		return address;
	}

	public Set<String> getCategories() {
		return categories;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public String getUrl() {
		return url;
	}

	public double getDistance() {
		return distance;
	}
	
	public String getDate() {
		return date;
	}
	
	public String getLocalTime() {
		return localTime;
	}

	public JSONObject toJSONObject() {

		JSONObject obj = new JSONObject();

		try {
			obj.put("item_id", itemId);
			obj.put("name", name);
			obj.put("rating", rating);
			obj.put("address", address);
			obj.put("categories", new JSONArray(categories));
			obj.put("image_url", imageUrl);
			obj.put("url", url);
			obj.put("distance", distance);
			obj.put("date", date);
			obj.put("local_time", localTime);

		} catch (JSONException e) {
			e.printStackTrace();
		}
		return obj;

	}

	public static class ItemBuilder {

		private String itemId;
		private String name;
		private double rating;
		private String address;
		private Set<String> categories;
		private String imageUrl;
		private String url;
		private double distance;
		private String date;
		private String localTime;

		public Item build() {
			return new Item(this);
		}

		public ItemBuilder setItemId(String itemId) {
			this.itemId = itemId;
			return this;
		}

		public ItemBuilder setName(String name) {
			this.name = name;
			return this;
		}

		public ItemBuilder setRating(double rating) {
			this.rating = rating;
			return this;
		}

		public ItemBuilder setAddress(String address) {
			this.address = address;
			return this;
		}

		public ItemBuilder setCategories(Set<String> categories) {
			this.categories = categories;
			return this;
		}

		public ItemBuilder setImageUrl(String imageUrl) {
			this.imageUrl = imageUrl;
			return this;
		}

		public ItemBuilder setUrl(String url) {
			this.url = url;
			return this;
		}

		public ItemBuilder setDistance(double distance) {
			this.distance = distance;
			return this;
		}
		
		public ItemBuilder setDate(String date) {
			this.date = date;
			return this;
		}
		
		public ItemBuilder setLocalTime(String localTime) {
			this.localTime = localTime;
			return this;
		}
		
	}

	private Item(ItemBuilder builder) {
		this.itemId = builder.itemId;
		this.name = builder.name;
		this.rating = builder.rating;
		this.address = builder.address;
		this.categories = builder.categories;
		this.imageUrl = builder.imageUrl;
		this.url = builder.url;
		this.distance = builder.distance;
		this.localTime = builder.localTime;
		this.date = builder.date;
	}
}