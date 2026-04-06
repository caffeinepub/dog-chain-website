import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Time "mo:core/Time";

actor {
  include MixinStorage();

  // Types
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price_cents : Nat;
    image : Storage.ExternalBlob;
    category : Text;
    inStock : Bool;
    featured : Bool;
    createdAt : Time.Time;
  };

  type HeroContent = {
    headline : Text;
    subheadline : Text;
    ctaText : Text;
    ctaLink : Text;
    backgroundImage : Storage.ExternalBlob;
  };

  type Feature = {
    id : Nat;
    title : Text;
    description : Text;
    iconName : Text;
    image : Storage.ExternalBlob;
    order : Nat;
  };

  type Testimonial = {
    id : Nat;
    authorName : Text;
    authorAvatar : Storage.ExternalBlob;
    quote : Text;
    rating : Nat;
    createdAt : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  // Storage
  let products = Map.empty<Nat, Product>();
  let features = Map.empty<Nat, Feature>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 1;
  var nextFeatureId = 1;
  var nextTestimonialId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var heroContent : ?HeroContent = null;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      if (product1.featured and not product2.featured) { return #less };
      if (not product1.featured and product2.featured) { return #greater };
      Int.compare(product2.createdAt, product1.createdAt);
    };
  };

  // Product Management
  public shared ({ caller }) func createProduct(product : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let newId = nextProductId;
    nextProductId += 1;

    let newProduct : Product = {
      product with
      id = newId;
      createdAt = Time.now();
    };
    products.add(newId, newProduct);
    newId;
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    let iter = products.values().filter(func(p) { p.featured });
    iter.toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Hero Content Management
  public shared ({ caller }) func updateHeroContent(content : HeroContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    heroContent := ?content;
  };

  public query ({ caller }) func getHeroContent() : async ?HeroContent {
    heroContent;
  };

  module Feature {
    public func compare(feature1 : Feature, feature2 : Feature) : Order.Order {
      Nat.compare(feature1.order, feature2.order);
    };
  };

  // Features Management
  public shared ({ caller }) func createFeature(feature : Feature) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let newId = nextFeatureId;
    nextFeatureId += 1;

    let newFeature : Feature = {
      feature with
      id = newId;
    };

    features.add(newId, newFeature);
    newId;
  };

  public shared ({ caller }) func updateFeature(id : Nat, feature : Feature) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not features.containsKey(id)) {
      Runtime.trap("Feature not found");
    };
    features.add(id, feature);
  };

  public shared ({ caller }) func deleteFeature(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not features.containsKey(id)) {
      Runtime.trap("Feature not found");
    };
    features.remove(id);
  };

  public query ({ caller }) func getFeatures() : async [Feature] {
    features.values().toArray().sort();
  };

  module Testimonial {
    public func compare(testimonial1 : Testimonial, testimonial2 : Testimonial) : Order.Order {
      Int.compare(testimonial2.createdAt, testimonial1.createdAt);
    };
  };

  // Testimonials Management
  public shared ({ caller }) func createTestimonial(testimonial : Testimonial) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let newId = nextTestimonialId;
    nextTestimonialId += 1;

    let newTestimonial : Testimonial = {
      testimonial with
      id = newId;
      createdAt = Time.now();
    };
    testimonials.add(newId, newTestimonial);
    newId;
  };

  public shared ({ caller }) func updateTestimonial(id : Nat, testimonial : Testimonial) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not testimonials.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };
    testimonials.add(id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    if (not testimonials.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };
    testimonials.remove(id);
  };

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray().sort();
  };
};
