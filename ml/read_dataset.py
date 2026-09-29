import pandas as pd

data = pd.read_csv(
    "data/amazon_cells_labelled.txt",
    sep="\t",
    header=None,
    names=["text", "sentiment"]
)

print(data.head())
print("\nTotal rows:", len(data))

# Convert labels
data["sentiment"] = data["sentiment"].map({
    0: "negative",
    1: "positive"
})

print("\nAfter converting labels:")
print(data.head())

print("\nLabel counts:")
print(data["sentiment"].value_counts())