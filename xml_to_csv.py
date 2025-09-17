import xml.etree.ElementTree as ET
import pandas as pd
import sys

def xml_to_csv(xml_file, csv_file, row_tag):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()

        rows = []
        for record in root.findall(f".//{row_tag}"):
            row_data = {}
            for child in record:
                row_data[child.tag] = child.text
            rows.append(row_data)

        if rows:
            df = pd.DataFrame(rows)
            df.to_csv(csv_file, index=False, encoding="utf-8")
            print(f"Conversion completed! Saved to {csv_file}")
        else:
            print(f"No rows found with tag <{row_tag}> in {xml_file}")

    except Exception as e:
        print(f" Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python xml_to_csv.py input.xml output.csv row_tag")
    else:
        xml_file = sys.argv[1]
        csv_file = sys.argv[2]
        row_tag = sys.argv[3]
        xml_to_csv(xml_file, csv_file, row_tag)
