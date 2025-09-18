import streamlit as st
import xml.etree.ElementTree as ET
import pandas as pd
import io
from collections import Counter

# Streamlit app title
st.title("XML to CSV Converter")

# File uploader for XML
st.write("Upload your XML file:")
uploaded_file = st.file_uploader("Choose an XML file", type=["xml"])

if uploaded_file is not None:
    try:
        # Parse the uploaded XML file safely
        tree = ET.parse(io.BytesIO(uploaded_file.read()))
        root = tree.getroot()

        # --- Auto-detect repeating tag ---
        tags = [elem.tag for elem in root.iter()]
        tag_counts = Counter(tags)

        # Remove the root tag from candidates
        tag_counts.pop(root.tag, None)

        # Choose the most frequent tag as the repeating tag
        row_tag, count = None, 0
        if tag_counts:
            row_tag, count = tag_counts.most_common(1)[0]

        if row_tag is None or count < 2:
            st.error("Could not detect a repeating tag in the XML file. Please check the structure.")
        else:
            st.success(f"Detected repeating tag: <{row_tag}> (found {count} entries)")

            # Extract data
            data = []
            for record in root.findall(f".//{row_tag}"):
                row = {}
                for child in record:
                    row[child.tag] = child.text if child.text is not None else ''
                data.append(row)

            # Convert to DataFrame
            if data:
                df = pd.DataFrame(data)
                st.write("Preview of the converted data:")
                st.dataframe(df)

                # Convert DataFrame to CSV
                csv_buffer = io.StringIO()
                df.to_csv(csv_buffer, index=False)
                csv_data = csv_buffer.getvalue()

                # Download button
                st.download_button(
                    label="Download CSV",
                    data=csv_data,
                    file_name="output.csv",
                    mime="text/csv"
                )
            else:
                st.error(f"No data found for tag <{row_tag}>. Please check your XML structure.")

    except ET.ParseError:
        st.error("Invalid XML file. Please upload a valid XML file.")
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")

# Instructions
st.write("""
### Instructions
1. Upload an XML file using the file uploader above.
2. The app will automatically detect the repeating tag (e.g., `<employee>`, `<item>`, `<book>`).
3. The app will parse the XML and display a preview of the data.
4. Click the 'Download CSV' button to download the converted CSV file.
""")
